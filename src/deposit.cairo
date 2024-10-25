#[starknet::contract]
mod Deposit {
    use alexandria_math::fast_power::fast_power;

    use ekubo::interfaces::core::{ICoreDispatcher, ICoreDispatcherTrait, ILocker, SwapParameters};
    use ekubo::types::i129::i129;
    use ekubo::types::keys::PoolKey;

    use openzeppelin_token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
    use spotnet::constants::ZK_SCALE_DECIMALS;

    use spotnet::interfaces::{IMarketDispatcher, IMarketDispatcherTrait, IDeposit};
    use spotnet::types::{SwapData, SwapResult, DepositData, ClaimData};

    use starknet::event::EventEmitter;
    use starknet::storage::{StoragePointerWriteAccess, StoragePointerReadAccess};
    use starknet::{ContractAddress, get_contract_address, get_caller_address};

    #[storage]
    struct Storage {
        owner: ContractAddress,
        ekubo_core: ICoreDispatcher,
        zk_market: IMarketDispatcher,
        is_position_open: bool
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        ekubo_core: ICoreDispatcher,
        zk_market: IMarketDispatcher
    ) {
        self.owner.write(owner);
        self.ekubo_core.write(ekubo_core);
        self.zk_market.write(zk_market);
    }

    fn get_borrow_amount(
        borrow_capacity: felt252, token_price: felt252, decimals_difference: felt252, total_borrowed: felt252
    ) -> felt252 {
        let borrow_const = 80;
        let amount_base_token = token_price * borrow_capacity;
        let amount_quote_token = amount_base_token.into() / decimals_difference.into();
        ((amount_quote_token - total_borrowed.into()) / 100_u256 * borrow_const).try_into().unwrap()
    }

    fn get_withdraw_amount(
        total_deposited: felt252,
        total_debt: felt252,
        collateral_factor: felt252,
        supply_token_price: felt252,
        debt_token_price: felt252,
        supply_decimals: u256,
        debt_decimals: u256
    ) -> felt252 {
        let deposited = (total_deposited * supply_token_price).into() / supply_decimals;
        let free_amount = (deposited * collateral_factor.into() / ZK_SCALE_DECIMALS)
            - total_debt.into();
        let withdraw_amount = free_amount * debt_token_price.into() / debt_decimals;
        withdraw_amount.try_into().unwrap()
    }

    #[derive(starknet::Event, Drop)]
    struct LiquidityLooped {
        initial_amount: u256,
        deposited: u256,
        token_deposit: ContractAddress,
        borrowed: u256,
        token_borrowed: ContractAddress
    }

    #[derive(starknet::Event, Drop)]
    struct PositionClosed {
        deposit_token: ContractAddress,
        debt_token: ContractAddress,
        withdrawn_amount: u256,
        repaid_amount: u256
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        LiquidityLooped: LiquidityLooped,
        PositionClosed: PositionClosed
    }

    #[abi(embed_v0)]
    impl Deposit of IDeposit<ContractState> {
        fn swap(ref self: ContractState, swap_data: SwapData) -> SwapResult {
            ekubo::components::shared_locker::call_core_with_callback(
                self.ekubo_core.read(), @swap_data
            )
        }

        fn loop_liquidity(
            ref self: ContractState,
            deposit_data: DepositData,
            pool_key: PoolKey,
            pool_price: felt252
        ) {
            assert(get_caller_address() == self.owner.read(), 'Caller is not an owner');
            assert(!self.is_position_open.read(), 'Open position already exists');
            let DepositData { token, amount, multiplier } = deposit_data;
            assert(amount != 0 && pool_price != 0, 'Parameters cannot be zero');
            assert(multiplier < 5, 'Multiplier not supported');
            let (EKUBO_LOWER_SQRT_LIMIT, EKUBO_UPPER_SQRT_LIMIT) = (
                18446748437148339061, 6277100250585753475930931601400621808602321654880405518632
            );
            let token_dispatcher = ERC20ABIDispatcher { contract_address: token };
            let zk_market = self.zk_market.read();
            let is_token1 = token == pool_key.token0;
            let (borrowing_token, sqrt_limit) = if is_token1 {
                (pool_key.token1, EKUBO_UPPER_SQRT_LIMIT)
            } else {
                (pool_key.token0, EKUBO_LOWER_SQRT_LIMIT)
            };
            let curr_contract_address = get_contract_address();

            token_dispatcher.transferFrom(self.owner.read(), curr_contract_address, amount);
            let reserve_data = zk_market.get_reserve_data(token);

            let collateral_factor = reserve_data.collateral_factor.into();

            zk_market.enable_collateral(token);

            let deposit_token_decimals = fast_power(
                10_u128, token_dispatcher.decimals().into()
            );
            token_dispatcher.approve(zk_market.contract_address, amount);
            zk_market.deposit(token, amount.try_into().expect('Overflow'));
            let mut deposited = amount;
            let mut total_borrowed = 0;
            let mut accumulated = 0;

            while (amount + accumulated) / amount < multiplier.into() {
                let borrow_capacity = (deposited * collateral_factor / ZK_SCALE_DECIMALS);
                let to_borrow = get_borrow_amount(
                    borrow_capacity.try_into().unwrap(), pool_price, deposit_token_decimals.into(), total_borrowed
                );
                total_borrowed += to_borrow;
                zk_market.borrow(borrowing_token, to_borrow);
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
                            contract_address: reserve_data.z_token_address
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

        fn close_position(
            ref self: ContractState,
            supply_token: ContractAddress,
            debt_token: ContractAddress,
            pool_key: PoolKey,
            supply_price: felt252,
            debt_price: felt252
        ) {
            assert(get_caller_address() == self.owner.read(), 'Caller is not an owner');
            assert(self.is_position_open.read(), 'Open position not exists');
            assert(supply_price != 0 && debt_price != 0, 'Parameters cannot be zero');
            let token_disp = ERC20ABIDispatcher { contract_address: supply_token };
            let zk_market = self.zk_market.read();
            let reserve_data = zk_market.get_reserve_data(supply_token);
            let z_token_disp = ERC20ABIDispatcher {
                contract_address: reserve_data.z_token_address
            };
            let contract_address = get_contract_address();
            let mut debt = zk_market.get_user_debt_for_token(contract_address, debt_token);

            let debt_dispatcher = ERC20ABIDispatcher { contract_address: debt_token };
            let (supply_decimals, debt_decimals) = (
                fast_power(10, token_disp.decimals().into()),
                fast_power(10, debt_dispatcher.decimals().into())
            );
            let (SQRT_LIMIT_REPAY, SQRT_LIMIT_WITHDRAW) = if supply_token == pool_key.token0 {
                (18446748437148339061, 6277100250585753475930931601400621808602321654880405518632)
            } else {
                (6277100250585753475930931601400621808602321654880405518632, 18446748437148339061)
            };
            let is_token1_repay_swap = supply_token == pool_key.token1;
            let mut repaid_amount: u256 = 0;
            while debt != 0 {
                let withdraw_amount = get_withdraw_amount(
                    z_token_disp.balanceOf(contract_address).try_into().unwrap(),
                    debt.into(),
                    reserve_data.collateral_factor.into(),
                    supply_price,
                    debt_price,
                    supply_decimals,
                    debt_decimals
                );
                zk_market.withdraw(supply_token, withdraw_amount.try_into().unwrap());

                let params = SwapParameters {
                    amount: i129 { mag: withdraw_amount.try_into().unwrap(), sign: false },
                    is_token1: is_token1_repay_swap,
                    sqrt_ratio_limit: SQRT_LIMIT_REPAY,
                    skip_ahead: 0
                };
                let delta = self
                    .swap(SwapData { params, pool_key, caller: contract_address })
                    .delta;
                let amount_swapped: u256 = if is_token1_repay_swap {
                    delta.amount0.mag.into()
                } else {
                    delta.amount1.mag.into()
                };

                if debt.into() > amount_swapped {
                    repaid_amount += amount_swapped;
                    debt_dispatcher.approve(zk_market.contract_address, amount_swapped.into());
                    zk_market.repay(debt_token, amount_swapped.try_into().unwrap());
                } else {
                    repaid_amount += debt.into();
                    debt_dispatcher.approve(zk_market.contract_address, debt.into());
                    zk_market.repay_all(debt_token);
                }

                debt = zk_market.get_user_debt_for_token(contract_address, debt_token);
            };

            let left = debt_dispatcher.balanceOf(contract_address);
            let params = SwapParameters {
                amount: i129 { mag: left.try_into().unwrap(), sign: false },
                is_token1: !is_token1_repay_swap,
                sqrt_ratio_limit: SQRT_LIMIT_WITHDRAW,
                skip_ahead: 0
            };
            self.swap(SwapData { params, pool_key, caller: contract_address });
            zk_market.withdraw_all(supply_token);
            zk_market.disable_collateral(supply_token);
            self.is_position_open.write(false);
            let withdrawn_amount = token_disp.balanceOf(contract_address);
            token_disp.transfer(self.owner.read(), withdrawn_amount);
            self
                .emit(
                    PositionClosed {
                        deposit_token: supply_token,
                        debt_token,
                        repaid_amount,
                        withdrawn_amount
                    }
                );
        }

	fn claim_rewards(
	    ref self: ContractState,
	    claim_data: ClaimData,
	    proofs: Span<felt252>
	) {
	    assert(self.is_position_open.read(), 'Position is not open');
	    
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
}
