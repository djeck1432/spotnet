#[starknet::contract]
pub mod Margin {
    use core::num::traits::Zero;
    use starknet::{
        event::EventEmitter,
        storage::{StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map},
        ContractAddress, get_contract_address, get_caller_address, get_block_timestamp,
    };
    use margin::constants::ONE_HUNDRED_PERCENT_IN_BPS;
    use margin::{
        interface::{
            IMargin, IERC20MetadataForPragmaDispatcherTrait, IERC20MetadataForPragmaDispatcher,
            IPragmaOracleDispatcher, IPragmaOracleDispatcherTrait,
        },
        types::{Position, TokenAmount, PositionParameters, SwapData, EkuboSlippageLimits},
        constants::SCALE_NUMBER,
    };
    use margin::mocks::erc20_mock::{};
    use alexandria_math::{BitShift, U256BitShift};

    use openzeppelin::token::erc20::interface::{
        IERC20Dispatcher, IERC20DispatcherTrait, IERC20MetadataDispatcher,
        IERC20MetadataDispatcherTrait,
    };
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::security::ReentrancyGuardComponent;
    use pragma_lib::types::{DataType, PragmaPricesResponse};

    use ekubo::{
        interfaces::core::{ICoreDispatcher, ILocker, ICoreDispatcherTrait, SwapParameters},
        types::{keys::PoolKey, delta::Delta, i129::i129},
        components::shared_locker::{consume_callback_data, handle_delta, call_core_with_callback},
    };

    use alexandria_math::pow;
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(
        path: ReentrancyGuardComponent, storage: reentrancy_guard, event: ReentrancyGuardEvent,
    );

    /// Ownable
    #[abi(embed_v0)]
    impl OwnableTwoStepMixinImpl =
        OwnableComponent::OwnableTwoStepMixinImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    /// ReentrancyGuard
    impl ReentrancyInternalImpl = ReentrancyGuardComponent::InternalImpl<ContractState>;

    #[derive(starknet::Event, Drop)]
    struct Deposit {
        depositor: ContractAddress,
        token: ContractAddress,
        amount: TokenAmount,
    }

    #[derive(starknet::Event, Drop)]
    struct Withdraw {
        withdrawer: ContractAddress,
        token: ContractAddress,
        amount: TokenAmount,
    }


    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
        Deposit: Deposit,
        Withdraw: Withdraw,
    }


    /// @field ownable: OwnableComponent::Storage
    /// - Holds ownership information for the contract.
    /// - Managed using substorage for modular ownership control.

    /// @field ekubo_core: ICoreDispatcher
    /// - Acts as the dispatcher for core operations.
    /// - Facilitates interaction with the core logic of the system.

    /// @field treasury_balances: Map<(ContractAddress, ContractAddress), TokenAmount>
    /// - Maps a tuple (depositor address, token address) to the amount of token held.
    /// - Used to track treasury token balances associated with each depositor and token.

    /// @field pools: Map<ContractAddress, TokenAmount>
    /// - Maps pool contract addresses to their corresponding token amounts.
    /// - Represents liquidity available in different pools.

    /// @field positions: Map<ContractAddress, Position>
    /// - Maps contract addresses to their associated positions.
    /// - Stores details of open positions tied to specific contracts.

    /// @field oracle_address: ContractAddress
    /// - Specifies the address of the oracle contract.
    /// - Used for fetching external data such as market prices.

    /// @field risk_factors: Map<ContractAddress, u128>
    /// - Maps token addresses to their risk factor values.
    /// - Helps in determining risk weights or multipliers for associated tokens.
    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        ekubo_core: ICoreDispatcher,
        treasury_balances: Map<(ContractAddress, ContractAddress), TokenAmount>,
        pools: Map<ContractAddress, TokenAmount>,
        positions: Map<ContractAddress, Position>,
        oracle_address: ContractAddress,
        risk_factors: Map<ContractAddress, u128>,
        #[substorage(v0)]
        reentrancy_guard: ReentrancyGuardComponent::Storage,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        ekubo_core: ICoreDispatcher,
        oracle_address: ContractAddress,
    ) {
        self.ownable.initializer(owner);
        self.ekubo_core.write(ekubo_core);
        self.oracle_address.write(oracle_address);
    }


    #[generate_trait]
    pub impl InternalImpl of InternalTrait {
        fn swap(ref self: ContractState, swap_data: SwapData) -> Delta {
            call_core_with_callback(self.ekubo_core.read(), @swap_data)
        }

        fn get_data(self: @ContractState, token: ContractAddress) -> PragmaPricesResponse {
            let token_symbol: felt252 = IERC20MetadataForPragmaDispatcher {
                contract_address: token,
            }
                .symbol();

            assert(token_symbol != 0, 'Token symbol is zero');

            let token_symbol_u256: u256 = token_symbol.into();
            let pair_id = BitShift::shl(token_symbol_u256, 32) + '/USD';

            IPragmaOracleDispatcher { contract_address: self.oracle_address.read() }
                .get_data_median(
                    DataType::SpotEntry(pair_id.try_into().expect('pair id overflows')),
                )
        }

        fn get_max_asset_multiplier(self: @ContractState, token: ContractAddress) -> u256 {
            let token_risk_factor: u256 = self.risk_factors.entry(token).read().into();
            token_risk_factor * 10 / (SCALE_NUMBER - token_risk_factor)
        }

        fn calculate_health_factor(
            self: @ContractState,
            position: @Position,
            initial_data: PragmaPricesResponse,
            debt_data: PragmaPricesResponse,
            decimals: (u8, u8),
        ) -> u256 {
            let risk_factor = self
                .risk_factors
                .entry(*position.debt_token)
                .read(); // TODO: Refactor to the LiquidationThreshold

            let (initial_token_decimals, debt_token_decimals) = decimals;
            let scale_down_power = initial_data.decimals
                + initial_token_decimals.into()
                - (debt_data.decimals + debt_token_decimals.into());
            let scale_down_number = if (scale_down_power != 0) {
                pow(10_u128, scale_down_power.into())
            } else {
                1
            };
            *position.traded_amount
                * initial_data.price.into()
                * risk_factor.into()
                / (*position.debt * debt_data.price.into())
                / scale_down_number.into()
        }

        /// Calculates the amount of `debt_token` to borrow based on the input `amount` of
        /// `initial_token`, their respective prices, and a leverage `multiplier`.
        ///
        /// # Arguments
        /// - `self`: Reference to the contract state for accessing token price data.
        /// - `initial_token`: Address of the token being used as collateral.
        /// - `debt_token`: Address of the token to borrow.
        /// - `amount`: Quantity of the `initial_token`.
        /// - `multiplier`: Leverage multiplier in bps (e.g., 20000 for 2x leverage).
        ///
        /// # Returns
        /// - `TokenAmount`: Calculated amount of `debt_token` to borrow.
        fn get_borrow_amount(
            self: @ContractState,
            initial_token: ContractAddress,
            debt_token: ContractAddress,
            amount: TokenAmount,
            multiplier: u64,
        ) -> TokenAmount {
            // 1000000000
            //  600000000
            // 16938102
            //
            let initial_token_price = self.get_data(initial_token).price;
            let debt_token_price = self.get_data(debt_token).price;
            assert(debt_token_price > 0, 'Debt token price is zero');
            assert(initial_token_price > 0, 'Initial token price is zero');
            println!("In borrow");
            println!("{multiplier}");
            println!("{}", amount * multiplier.into() - amount * 10);
            // Convert multiplier to u256 for precision
            println!("Init {initial_token_price}");
            println!("Debt {debt_token_price}");
            let debt_amount: u256 = (amount * multiplier.into() - amount * 10)
                * SCALE_NUMBER
                / 10
                * initial_token_price.into()
                / (debt_token_price.into())
                / SCALE_NUMBER;
            debt_amount
        }
    }


    #[abi(embed_v0)]
    impl Margin of IMargin<ContractState> {
        /// Deposits specified amount of ERC20 tokens into the contract's treasury
        /// @param token The contract address of the ERC20 token to deposit
        /// @param amount The amount of tokens to deposit
        /// @dev Transfers tokens from caller to contract and updates balances
        fn deposit(ref self: ContractState, token: ContractAddress, amount: TokenAmount) {
            assert(amount.is_non_zero(), 'Amount is zero');
            let token_dispatcher = IERC20Dispatcher { contract_address: token };
            let (depositor, contract) = (get_caller_address(), get_contract_address());

            assert(
                token_dispatcher.allowance(depositor, contract) >= amount, 'Insufficient allowance',
            );
            assert(token_dispatcher.balance_of(depositor) >= amount, 'Insufficient balance');

            let user_balance = self.treasury_balances.entry((depositor, token)).read();
            self.treasury_balances.entry((depositor, token)).write(user_balance + amount);

            self.pools.entry(token).write(self.pools.entry(token).read() + amount);
            token_dispatcher.transfer_from(depositor, contract, amount);

            self.emit(Deposit { depositor, token, amount });
        }

        fn withdraw(ref self: ContractState, token: ContractAddress, amount: TokenAmount) {
            assert(amount > 0, 'Withdraw amount is zero');

            let withdrawer = get_caller_address();

            let user_treasury_amount = self.treasury_balances.entry((withdrawer, token)).read();
            assert(amount <= user_treasury_amount, 'Insufficient user treasury');

            self.treasury_balances.entry((withdrawer, token)).write(user_treasury_amount - amount);
            IERC20Dispatcher { contract_address: token }.transfer(withdrawer, amount);

            self.pools.entry(token).write(self.pools.entry(token).read() - amount);
            self.emit(Withdraw { withdrawer, token, amount });
        }

        fn open_margin_position(
            ref self: ContractState,
            position_parameters: PositionParameters,
            pool_key: PoolKey,
            ekubo_limits: EkuboSlippageLimits,
        ) {
            self.reentrancy_guard.start();

            let caller = get_caller_address();
            let existing_position = self.positions.entry(caller).read();

            assert(!existing_position.is_open, 'User already has a position');

            let PositionParameters {
                initial_token, debt_token, amount, multiplier,
            } = position_parameters;

            let (is_token1, sqrt_ratio_limit) = if initial_token == pool_key.token0 {
                (false, ekubo_limits.upper)
            } else {
                assert(pool_key.token0 == debt_token, 'Incorrect pool key');
                (true, ekubo_limits.lower)
            };

            let (initial_token_data, debt_token_data) = (
                self.get_data(initial_token), self.get_data(debt_token),
            );

            assert(initial_token_data.price > 0, 'Initial token not supported');
            assert(debt_token_data.price > 0, 'Debt token not supported');

            // Validate that the two tokens are different.
            assert(initial_token != debt_token, 'Tokens must be different');
            let contract_addr = get_contract_address();

            // Validate allowance and balance for the initial token (collateral).
            let initial_token_disp = IERC20Dispatcher { contract_address: initial_token };
            let allowance = initial_token_disp.allowance(caller, contract_addr);
            assert(allowance >= amount, 'Insufficient allowance');
            let balance = initial_token_disp.balance_of(caller);
            assert(balance >= amount, 'Insufficient balance');

            initial_token_disp.transfer_from(caller, contract_addr, amount);

            let desired_amount = (amount * multiplier.into() - amount * 10) / 10;

            let delta = self
                .swap(
                    SwapData {
                        params: SwapParameters {
                            amount: i129 { mag: desired_amount.try_into().unwrap(), sign: true },
                            is_token1: is_token1,
                            sqrt_ratio_limit,
                            skip_ahead: 0,
                        },
                        pool_key,
                        caller: contract_addr,
                    },
                );

            let amount_swapped: u256 = if is_token1 {
                delta.amount0.mag.into()
            } else {
                delta.amount1.mag.into()
            };

            let position = Position {
                initial_token,
                debt_token,
                traded_amount: amount + ((amount * multiplier.into() - amount * 10) / 10),
                debt: amount_swapped,
                is_open: true,
                open_time: get_block_timestamp(),
            };

            let decimals = (
                IERC20MetadataDispatcher { contract_address: initial_token }.decimals(),
                IERC20MetadataDispatcher { contract_address: debt_token }.decimals(),
            );

            assert(
                self
                    .calculate_health_factor(
                        @position, initial_token_data, debt_token_data, decimals,
                    ) > SCALE_NUMBER,
                'Health Factor is too low',
            );
            self.positions.entry(caller).write(position);

            self.reentrancy_guard.end();
        }
        fn close_position(
            ref self: ContractState, pool_key: PoolKey, ekubo_limits: EkuboSlippageLimits,
        ) {}
        fn liquidate(
            ref self: ContractState,
            user: ContractAddress,
            pool_key: PoolKey,
            ekubo_limits: EkuboSlippageLimits,
        ) {}

        /// Calculates the health factor for a given contract address based on its position and
        /// associated risk factor.
        /// @dev The health factor is determined by multiplying the traded amount with the price of
        /// the initial token, the scaling constant (SCALE_NUMBER),
        ///      and the risk factor, then dividing by the product of the debt, the price of the
        ///      debt token, and the scaling constant (SCALE_NUMBER).
        /// Requirements:
        /// - The traded_amount in the position must be greater than zero.
        /// - The debt in the position must be greater than zero.
        /// @param address The contract address used to retrieve the position and risk factor.
        /// @return u256 The computed health factor as a 256-bit unsigned integer.
        fn get_health_factor(self: @ContractState, address: ContractAddress) -> u256 {
            let position: Position = self.positions.entry(address).read();

            assert(position.traded_amount > 0, 'Traded amount is zero');
            assert(position.debt > 0, 'Debt is zero');

            self
                .calculate_health_factor(
                    @position,
                    self.get_data(position.initial_token),
                    self.get_data(position.debt_token),
                    (
                        IERC20MetadataDispatcher { contract_address: position.initial_token }
                            .decimals(),
                        IERC20MetadataDispatcher { contract_address: position.debt_token }
                            .decimals(),
                    ),
                )
        }

        /// Sets the risk factor for a given token in the contract state.
        /// @dev Only the contract owner can call this function. The risk factor is scaled by
        /// multiplying by 10 and dividing by SCALE_NUMBER.
        ///      The resulting value must be between 1 and 10 (inclusive); otherwise, the function
        ///      will revert with an error.
        /// Requirements:
        /// - Only the owner can execute this function.
        /// - The risk factor, when adjusted according to the scaling factor, must be at least 1 and
        /// at most 10.
        /// @param token The contract address representing the token for which the risk factor is
        /// being set.
        /// @param risk_factor The unscaled risk factor value to assign to the token.
        fn set_risk_factor(ref self: ContractState, token: ContractAddress, risk_factor: u128) {
            self.ownable.assert_only_owner();
            let risk_factor_check = (risk_factor * 10).into() / SCALE_NUMBER;
            assert(risk_factor_check >= 1, 'Risk factor less than needed');
            assert(risk_factor_check <= 10, 'Risk factor more than needed');
            self.risk_factors.entry(token).write(risk_factor);
        }

        /// Checks if the position for a given contract address is healthy based on its health
        /// factor.
        /// @param address The contract address used to retrieve the health factor.
        fn is_position_healthy(ref self: ContractState, address: ContractAddress) -> bool {
            let health_factor = self.get_health_factor(address);
            health_factor > SCALE_NUMBER
        }
    }

    #[abi(embed_v0)]
    impl Locker of ILocker<ContractState> {
        fn locked(ref self: ContractState, id: u32, data: Span<felt252>) -> Span<felt252> {
            let core = self.ekubo_core.read();
            let SwapData { pool_key, params, caller } = consume_callback_data(core, data);
            let delta = core.swap(pool_key, params);

            let (debt_token, amount) = if params.is_token1 {
                (pool_key.token0, delta.amount0.mag.into())
            } else {
                (pool_key.token1, delta.amount1.mag.into())
            };
            // println!("{debt_token:x}");
            // println!("Amount 0: {}", delta.amount0.mag);
            // println!("Amount 1: {}", delta.amount1.mag);
            assert(self.pools.entry(debt_token).read() >= amount, 'Invalid borrow amount');
            // println!("Amount 0: {}", delta.amount0.mag);
            // println!("Amount 1: {}", delta.amount1.mag);
            handle_delta(core, pool_key.token0, delta.amount0, caller);
            handle_delta(core, pool_key.token1, delta.amount1, caller);

            let mut arr: Array<felt252> = ArrayTrait::new();
            Serde::serialize(@delta, ref arr);
            arr.span()
        }
    }
}
