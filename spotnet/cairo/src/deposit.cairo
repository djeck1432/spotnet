#[starknet::contract]
mod Deposit {
    use openzeppelin::access::ownable::interface::OwnableTwoStepABI;
use super::super::interfaces::IVaultDispatcherTrait;
use alexandria_math::fast_power::fast_power;
    use core::num::traits::Zero;

    use ekubo::{
        interfaces::core::{ICoreDispatcher, ICoreDispatcherTrait, ILocker, SwapParameters},
        types::{i129::i129, keys::PoolKey}
    };

    use openzeppelin::{
        security::ReentrancyGuardComponent,
        token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait},
        upgrades::{UpgradeableComponent, interface::IUpgradeable}, access::ownable::OwnableComponent
    };
    use spotnet::{
        constants::{ZK_SCALE_DECIMALS, STRK_ADDRESS},
        interfaces::{
            IMarketDispatcher, IMarketDispatcherTrait, IAirdropDispatcher, IAirdropDispatcherTrait,
            IDeposit, IVaultDispatcher
        },
        types::{
            SwapData, SwapResult, DepositData, Claim, EkuboSlippageLimits, TokenAmount, TokenPrice,
            DecimalScale, VaultRepayData
        }
    };

    use starknet::{
        ContractAddress, ClassHash, get_contract_address, get_tx_info, get_caller_address,
        event::EventEmitter, storage::{StoragePointerWriteAccess, StoragePointerReadAccess}
    };

    component!(
        path: ReentrancyGuardComponent, storage: reentrancy_guard, event: ReentrancyGuardEvent
    );
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    #[abi(embed_v0)]
    impl OwnableTwoStepMixinImpl =
        OwnableComponent::OwnableTwoStepMixinImpl<ContractState>;

    impl ReentrancyInternalImpl = ReentrancyGuardComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        ekubo_core: ICoreDispatcher,
        zk_market: IMarketDispatcher,
        treasury: ContractAddress,
        is_position_open: bool,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        reentrancy_guard: ReentrancyGuardComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        ekubo_core: ICoreDispatcher,
        zk_market: IMarketDispatcher,
        treasury: ContractAddress
    ) {
        assert(owner.is_non_zero(), 'Owner address is zero');
        self.ownable.initializer(owner);
        self.ekubo_core.write(ekubo_core);
        self.zk_market.write(zk_market);
        self.treasury.write(treasury);
    }

    fn get_borrow_amount(
        borrow_capacity: TokenAmount,
        token_price: TokenPrice,
        deposit_token_decimals: DecimalScale,
        total_borrowed: TokenAmount,
        borrow_portion_percent: u8
    ) -> u256 {
        // Borrow capacity already scaled.
        let amount_borrow_token = borrow_capacity
            * token_price.into()
            / deposit_token_decimals.into();
        ((amount_borrow_token - (total_borrowed * ZK_SCALE_DECIMALS))
            * borrow_portion_percent.into()
            / 100)
            / ZK_SCALE_DECIMALS
    }

    fn get_withdraw_amount(
        total_deposited: TokenAmount,
        total_debt: TokenAmount,
        collateral_factor: felt252,
        borrow_factor: felt252,
        borrow_portion_percent: u8,
        supply_token_price: TokenPrice,
        debt_token_price: TokenPrice,
        supply_decimals: DecimalScale,
        debt_decimals: DecimalScale
    ) -> u256 {
        let deposited = ((total_deposited * ZK_SCALE_DECIMALS * supply_token_price.into())
            / supply_decimals.into());
        let free_amount = (((deposited * collateral_factor.into() / ZK_SCALE_DECIMALS)
            * borrow_factor.into()
            / ZK_SCALE_DECIMALS))
            - (total_debt.into() * ZK_SCALE_DECIMALS);
        ((free_amount * debt_token_price.into() / debt_decimals.into())
            * borrow_portion_percent.into()
            / 100)
            / ZK_SCALE_DECIMALS
    }

    #[derive(starknet::Event, Drop)]
    struct LiquidityLooped {
        initial_amount: TokenAmount,
        deposited: TokenAmount,
        token_deposit: ContractAddress,
        borrowed: TokenAmount,
        token_borrowed: ContractAddress
    }

    #[derive(starknet::Event, Drop)]
    struct PositionClosed {
        deposit_token: ContractAddress,
        debt_token: ContractAddress,
        withdrawn_amount: TokenAmount,
        repaid_amount: TokenAmount
    }

    #[derive(starknet::Event, Drop)]
    struct Withdraw {
        token: ContractAddress,
        amount: TokenAmount
    }

    #[derive(starknet::Event, Drop)]
    struct ExtraDeposit {
        token: ContractAddress,
        amount: TokenAmount,
        depositor: ContractAddress
    }

    #[derive(starknet::Event, Drop)]
    struct RewardClaimed {
        treasury_amount: TokenAmount,
        user_amount: TokenAmount
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        LiquidityLooped: LiquidityLooped,
        PositionClosed: PositionClosed,
        Withdraw: Withdraw,
        ExtraDeposit: ExtraDeposit,
        RewardClaimed: RewardClaimed,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn swap(ref self: ContractState, swap_data: SwapData) -> SwapResult {
            ekubo::components::shared_locker::call_core_with_callback(
                self.ekubo_core.read(), @swap_data
            )
        }
        fn repay_vaults(ref self: ContractState, supply_token: ContractAddress, vaults: Span<VaultRepayData>){
            let zk_market = self.zk_market.read();
            let contract_address = get_contract_address();
            let owner = self.owner();

            for vault in vaults {
                let vault_disp = IVaultDispatcher{contract_address: (*vault).vault};
                let vault_token = vault_disp.get_vault_token();
                if vault_token == supply_token {
                    continue;
                }
                let mut amount = (*vault).amount;
                let token_disp = ERC20ABIDispatcher { contract_address: vault_token };

                if amount == 0 {
                    zk_market.withdraw_all(vault_token);
                    amount = token_disp.balanceOf(contract_address);
                } else {
                    zk_market.withdraw(vault_token, amount.try_into().unwrap());
                }

                token_disp.approve((*vault).vault, amount);
                vault_disp.return_liquidity(owner, amount);
            }
        }
    }

    #[abi(embed_v0)]
    impl Deposit of IDeposit<ContractState> {
        /// Loops collateral token on ZKlend.
        ///
        /// # Panics
        ///
        /// `is_position_open` storage variable is set to true('Open position already exists')
        /// `amount` field of `deposit_data` is `0` or `pool_price` is `0`
        /// address of the caller is not equal to `owner` storage address
        ///
        /// # Parameters
        /// * `deposit_data`: DepositData - Object which stores main deposit information.
        /// * `pool_key`: PoolKey - Ekubo type which represents data about pool.
        /// * `ekubo_limits`: EkuboSlippageLimits - Represents upper and lower sqrt_ratio values on
        /// Ekubo. Used to control slippage while swapping.
        /// * `pool_price`: TokenPrice - Price of `deposit` token in terms of `debt` token.
        fn loop_liquidity(
            ref self: ContractState,
            deposit_data: DepositData,
            pool_key: PoolKey,
            ekubo_limits: EkuboSlippageLimits,
            pool_price: TokenPrice
        ) {
            let user_account = get_tx_info().unbox().account_contract_address;
            assert(user_account == self.ownable.owner(), 'Caller is not the owner');
            assert(!self.is_position_open.read(), 'Open position already exists');
            let DepositData { token, amount, multiplier, borrow_portion_percent } = deposit_data;
            assert(
                borrow_portion_percent > 0 && borrow_portion_percent < 100,
                'Cannot calculate borrow amount'
            );
            assert(multiplier < 51 && multiplier > 10, 'Multiplier not supported');
            assert(amount != 0 && pool_price != 0, 'Parameters cannot be zero');

            let token_dispatcher = ERC20ABIDispatcher { contract_address: token };

            let curr_contract_address = get_contract_address();
            assert(
                token_dispatcher.allowance(user_account, curr_contract_address) >= amount,
                'Approved amount insufficient'
            );
            assert(token_dispatcher.balanceOf(user_account) >= amount, 'Insufficient balance');

            let zk_market = self.zk_market.read();

            let (is_token1, borrowing_token, sqrt_limit) = if token == pool_key.token0 {
                (true, pool_key.token1, ekubo_limits.upper)
            } else {
                (false, pool_key.token0, ekubo_limits.lower)
            };

            token_dispatcher.transferFrom(self.ownable.owner(), curr_contract_address, amount);
            let (deposit_reserve_data, debt_reserve_data) = (
                zk_market.get_reserve_data(token), zk_market.get_reserve_data(borrowing_token)
            );

            let (collateral_factor, borrow_factor) = (
                deposit_reserve_data.collateral_factor.into(),
                debt_reserve_data.borrow_factor.into()
            );

            zk_market.enable_collateral(token);

            token_dispatcher.approve(zk_market.contract_address, amount);
            zk_market.deposit(token, amount.try_into().expect('Overflow'));

            let deposit_token_decimals = fast_power(10_u64, token_dispatcher.decimals().into());
            let mut total_borrowed = 0;
            let mut accumulated = 0;
            let mut deposited = amount;

            while (amount + accumulated) * 10 / amount < multiplier.into() {
                let borrow_capacity = ((deposited
                    * ZK_SCALE_DECIMALS
                    * collateral_factor
                    / ZK_SCALE_DECIMALS)
                    * borrow_factor
                    / ZK_SCALE_DECIMALS);
                let to_borrow = get_borrow_amount(
                    borrow_capacity.try_into().unwrap(),
                    pool_price,
                    deposit_token_decimals.into(),
                    total_borrowed,
                    borrow_portion_percent
                );
                total_borrowed += to_borrow;
                zk_market.borrow(borrowing_token, to_borrow.try_into().unwrap());
                let params = SwapParameters {
                    amount: i129 { mag: to_borrow.try_into().unwrap(), sign: false },
                    is_token1,
                    sqrt_ratio_limit: sqrt_limit,
                    skip_ahead: 0
                };
                let swapped_delta = self
                    .swap(SwapData { params, caller: curr_contract_address, pool_key })
                    .delta;
                let amount_swapped = if is_token1 {
                    swapped_delta.amount0.mag.into()
                } else {
                    swapped_delta.amount1.mag.into()
                };
                token_dispatcher.approve(zk_market.contract_address, amount_swapped.into());
                zk_market.deposit(token, amount_swapped);
                deposited += amount_swapped.into();
                accumulated += amount_swapped.into();
            };
            self.is_position_open.write(true);
            self
                .emit(
                    LiquidityLooped {
                        initial_amount: amount,
                        deposited: ERC20ABIDispatcher {
                            contract_address: deposit_reserve_data.z_token_address
                        }
                            .balanceOf(get_contract_address()),
                        token_deposit: token,
                        borrowed: zk_market
                            .get_user_debt_for_token(curr_contract_address, borrowing_token)
                            .into(),
                        token_borrowed: borrowing_token
                    }
                );
        }

        /// Closes position on ZKlend.
        ///
        /// # Panics
        ///
        /// `is_position_open` storage variable is set to false('Open position not exists')
        /// `supply_price` or `debt_price` is `0`
        /// address of the caller is not equal to `owner` storage address
        ///
        /// # Paraemters
        /// * `supply_token`: ContractAddress - Address of the token used as collateral.
        /// * `debt_token`: ContractAddress - Address of the token used as borrowing.
        /// * `pool_key`: PoolKey - Ekubo type for obtaining info about the pool and swapping
        /// tokens.
        /// * `ekubo_limits`: EkuboSlippageLimits - Represents upper and lower sqrt_ratio values on
        /// Ekubo. Used to control slippage while swapping.
        /// * `repay_const`: u8 - Sets how much to borrow from free amount.
        /// * `supply_price`: TokenPrice - Price of `supply` token in terms of `debt` token.
        /// * `debt_price`: TokenPrice - Price of `debt` token in terms of `supply` token.
        /// * `repay_vaults`: Span<VaultRepayData> - Vaults that need to be repaid.
        fn close_position(
            ref self: ContractState,
            supply_token: ContractAddress,
            debt_token: ContractAddress,
            pool_key: PoolKey,
            ekubo_limits: EkuboSlippageLimits,
            borrow_portion_percent: u8,
            supply_price: TokenPrice,
            debt_price: TokenPrice,
            repay_vaults: Span<VaultRepayData>
        ) {
            assert(
                get_tx_info().unbox().account_contract_address == self.ownable.owner(),
                'Caller is not the owner'
            );
            assert(self.is_position_open.read(), 'Open position not exists');
            assert(supply_price != 0 && debt_price != 0, 'Parameters cannot be zero');
            let token_disp = ERC20ABIDispatcher { contract_address: supply_token };
            let zk_market = self.zk_market.read();
            let (deposit_reserve_data, debt_reserve_data) = (
                zk_market.get_reserve_data(supply_token), zk_market.get_reserve_data(debt_token)
            );

            let (collateral_factor, borrow_factor) = (
                deposit_reserve_data.collateral_factor.into(),
                debt_reserve_data.borrow_factor.into()
            );

            let z_token_disp = ERC20ABIDispatcher {
                contract_address: deposit_reserve_data.z_token_address
            };
            let contract_address = get_contract_address();
            let mut debt = zk_market.get_user_debt_for_token(contract_address, debt_token).into();

            let debt_dispatcher = ERC20ABIDispatcher { contract_address: debt_token };
            let (supply_decimals, debt_decimals) = (
                fast_power(10, token_disp.decimals().into()),
                fast_power(10, debt_dispatcher.decimals().into())
            );
            let SQRT_LIMIT_REPAY = if supply_token == pool_key.token0 {
                ekubo_limits.lower
            } else {
                ekubo_limits.upper
            };
            let is_token1_repay_swap = supply_token == pool_key.token1;
            let mut repaid_amount: u256 = 0;
            while debt != 0 {
                let withdraw_amount = get_withdraw_amount(
                    z_token_disp.balanceOf(contract_address).try_into().unwrap(),
                    debt,
                    collateral_factor,
                    borrow_factor,
                    borrow_portion_percent,
                    supply_price,
                    debt_price,
                    supply_decimals,
                    debt_decimals
                );
                zk_market.withdraw(supply_token, withdraw_amount.try_into().unwrap());

                let params = if (debt > (withdraw_amount
                    * ZK_SCALE_DECIMALS
                    * supply_price.into()
                    / supply_decimals.into())
                    / ZK_SCALE_DECIMALS) {
                    SwapParameters {
                        amount: i129 { mag: withdraw_amount.try_into().unwrap(), sign: false },
                        is_token1: is_token1_repay_swap,
                        sqrt_ratio_limit: SQRT_LIMIT_REPAY,
                        skip_ahead: 0
                    }
                } else {
                    SwapParameters {
                        amount: i129 { mag: debt.try_into().unwrap(), sign: true },
                        is_token1: !is_token1_repay_swap,
                        sqrt_ratio_limit: SQRT_LIMIT_REPAY,
                        skip_ahead: 0
                    }
                };

                let delta = self
                    .swap(SwapData { params, pool_key, caller: contract_address })
                    .delta;
                let amount_swapped: u256 = if is_token1_repay_swap {
                    delta.amount0.mag.into()
                } else {
                    delta.amount1.mag.into()
                };
                if debt > amount_swapped {
                    repaid_amount += amount_swapped;
                    debt_dispatcher.approve(zk_market.contract_address, amount_swapped.into());
                    zk_market.repay(debt_token, amount_swapped.try_into().unwrap());
                } else {
                    repaid_amount += debt;
                    debt_dispatcher.approve(zk_market.contract_address, debt);
                    zk_market.repay_all(debt_token);
                    break;
                }

                debt = zk_market.get_user_debt_for_token(contract_address, debt_token).into();
            };
            zk_market.withdraw_all(supply_token);
            zk_market.disable_collateral(supply_token);
            self.repay_vaults(supply_token, repay_vaults);
            self.is_position_open.write(false);
            let withdrawn_amount = token_disp.balanceOf(contract_address);
            token_disp.transfer(self.ownable.owner(), withdrawn_amount);
            self
                .emit(
                    PositionClosed {
                        deposit_token: supply_token, debt_token, repaid_amount, withdrawn_amount
                    }
                );
        }

        /// Claims STRK airdrop on ZKlend
        ///
        /// Can be called by anyone, e.g. a keeper
        ///
        /// If the treasury address is zero, the funds are not sent to treasury to avoid burning
        /// them.
        /// This does mean that a sophisticated user could deploy their own contract with a zero
        /// treasury address to avoid sending on fees.
        ///
        /// # Panics
        /// `is_position_open` storage variable is set to false('Open position not exists')
        /// `proof` span is empty
        /// Claim call failed
        ///
        /// # Parameters
        /// `claim_data`: Claim - contains data about claim operation
        /// `proof`: Span<felt252> - proof used to validate the claim
        /// `airdrop_addr`: ContractAddress - address of a contract responsible for claim
        fn claim_reward(
            ref self: ContractState,
            claim_data: Claim,
            proof: Span<felt252>,
            airdrop_addr: ContractAddress
        ) {
            assert(
                IAirdropDispatcher { contract_address: airdrop_addr }.claim(claim_data, proof),
                'Claim failed'
            );

            let strk = ERC20ABIDispatcher { contract_address: STRK_ADDRESS.try_into().unwrap() };
            let zk_market = self.zk_market.read();
            let part_for_treasury = claim_data.amount
                - claim_data.amount / 2; // u128 integer division, rounds down

            let treasury_addr = self.treasury.read();
            let remainder = if (treasury_addr
                .into() != 0) { // Zeroable not publicly accessible in this Cairo version AFAIK
                strk.transfer(treasury_addr, part_for_treasury.into());
                claim_data.amount - part_for_treasury
            } else {
                claim_data.amount
            };

            strk.approve(zk_market.contract_address, remainder.into());
            zk_market.deposit(STRK_ADDRESS.try_into().unwrap(), remainder.into());
            zk_market.enable_collateral(STRK_ADDRESS.try_into().unwrap());

            self
                .emit(
                    RewardClaimed {
                        treasury_amount: part_for_treasury.into(), user_amount: remainder.into()
                    }
                );
        }

        /// Makes a deposit into open zkLend position to control stability
        ///
        /// Anyone can deposit theoretically
        ///
        /// # Panics
        /// `is_position_open` variable is set to false
        /// `amount` is equal to zero
        ///
        /// # Parameters
        /// `token`: ContractAddress - token address to withdraw from zkLend
        /// `amount`: TokenAmount - amount to withdraw
        fn extra_deposit(ref self: ContractState, token: ContractAddress, amount: TokenAmount) {
            self.reentrancy_guard.start();
            assert(self.is_position_open.read(), 'Open position not exists');
            assert(amount != 0, 'Deposit amount is zero');

            let (zk_market, token_dispatcher) = (
                self.zk_market.read(), ERC20ABIDispatcher { contract_address: token }
            );
            let (depositor, current_contract) = (get_caller_address(), get_contract_address());

            assert(
                token_dispatcher.allowance(depositor, current_contract) >= amount,
                'Approved amount insufficient'
            );
            assert(token_dispatcher.balanceOf(depositor) >= amount, 'Insufficient balance');

            token_dispatcher.transferFrom(depositor, current_contract, amount);
            token_dispatcher.approve(zk_market.contract_address, amount);

            zk_market.enable_collateral(token);
            zk_market.deposit(token, amount.try_into().unwrap());

            self.emit(ExtraDeposit { token, amount, depositor });
            self.reentrancy_guard.end();
        }

        /// Withdraws tokens from zkLend position and transfers them to the owner.
        ///
        /// # Panics
        /// address of account that started the transaction is not equal to `owner` storage variable
        ///
        /// # Parameters
        /// `token`: TokenAddress - token address to withdraw from zkLend
        /// `amount`: TokenAmount - amount to withdraw. Pass `0` to withdraw all
        fn withdraw(ref self: ContractState, token: ContractAddress, amount: TokenAmount) {
            assert(
                get_tx_info().unbox().account_contract_address == self.ownable.owner(),
                'Caller is not the owner'
            );

            let zk_market = self.zk_market.read();

            let token_dispatcher = ERC20ABIDispatcher { contract_address: token };
            let mut withdrawn_amount = amount;
            if amount == 0 {
                let current_contract = get_contract_address();
                let initial_balance = ERC20ABIDispatcher { contract_address: token }
                    .balanceOf(current_contract);
                zk_market.withdraw_all(token);
                let new_balance = ERC20ABIDispatcher { contract_address: token }
                    .balanceOf(current_contract);
                withdrawn_amount = new_balance - initial_balance;
                token_dispatcher.transfer(self.ownable.owner(), new_balance);
            } else {
                zk_market.withdraw(token, amount.try_into().unwrap());
                token_dispatcher.transfer(self.ownable.owner(), amount);
            };
            self.emit(Withdraw { token, amount: withdrawn_amount });
        }

        /// Returns the status of the position
        fn is_position_open(self: @ContractState) -> bool {
            return self.is_position_open.read();
        }
    }

    #[abi(embed_v0)]
    impl Locker of ILocker<ContractState> {
        fn locked(ref self: ContractState, id: u32, data: Span<felt252>) -> Span<felt252> {
            let core = self.ekubo_core.read();
            let SwapData { pool_key, params, caller } =
                ekubo::components::shared_locker::consume_callback_data::<
                SwapData
            >(core, data);
            let delta = core.swap(pool_key, params);
            ekubo::components::shared_locker::handle_delta(
                core, pool_key.token0, delta.amount0, caller
            );
            ekubo::components::shared_locker::handle_delta(
                core, pool_key.token1, delta.amount1, caller
            );
            let swap_result = SwapResult { delta };

            let mut arr: Array<felt252> = ArrayTrait::new();
            Serde::serialize(@swap_result, ref arr);
            arr.span()
        }
    }

    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            assert(
                get_tx_info().unbox().account_contract_address == self.ownable.owner(),
                'Caller is not the owner'
            );

            self.upgradeable.upgrade(new_class_hash);
        }
    }
}
