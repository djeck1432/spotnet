#[starknet::contract]
pub mod Margin {
    use openzeppelin::token::erc20::interface::IERC20DispatcherTrait;
    use core::num::traits::Zero;
    use starknet::{
        event::EventEmitter,
        storage::{StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map},
        ContractAddress, get_contract_address, get_caller_address,
    };
    use margin::constants::ONE_HUNDRED_PERCENT_IN_BPS;
    use margin::{
        interface::{
            IMargin, IERC20MetadataForPragmaDispatcherTrait, IERC20MetadataForPragmaDispatcher,
            IPragmaOracleDispatcher, IPragmaOracleDispatcherTrait,
        },
        types::{Position, TokenAmount, PositionParameters, SwapData, EkuboSlippageLimits},
    };
    use margin::mocks::erc20_mock::{};
    use alexandria_math::{BitShift, U256BitShift};

    use openzeppelin::token::erc20::interface::{IERC20Dispatcher};
    use pragma_lib::types::{DataType, PragmaPricesResponse};

    use ekubo::{
        interfaces::core::{ICoreDispatcher, ILocker, ICoreDispatcherTrait},
        types::{keys::PoolKey, delta::Delta},
        components::shared_locker::{consume_callback_data, handle_delta, call_core_with_callback},
    };

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
        Deposit: Deposit,
        Withdraw: Withdraw,
    }

    #[storage]
    struct Storage {
        ekubo_core: ICoreDispatcher,
        treasury_balances: Map<(ContractAddress, ContractAddress), TokenAmount>,
        pools: Map<ContractAddress, TokenAmount>,
        positions: Map<ContractAddress, Position>,
        oracle_address: ContractAddress,
        risk_factors: Map<ContractAddress, u128>,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, ekubo_core: ICoreDispatcher, oracle_address: ContractAddress,
    ) {
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
            let initial_token_price = self.get_data(initial_token).price;
            let debt_token_price = self.get_data(debt_token).price;
            assert(debt_token_price > 0, 'Debt token price is zero');
            assert(initial_token_price > 0, 'Initial token price is zero');

            // Convert multiplier to u256 for precision
            let debt_amount: u256 = amount
                * initial_token_price.into()
                * (multiplier - ONE_HUNDRED_PERCENT_IN_BPS).into()
                / ONE_HUNDRED_PERCENT_IN_BPS.into()
                / debt_token_price.into();

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
        ) {}
        fn close_position(
            ref self: ContractState, pool_key: PoolKey, ekubo_limits: EkuboSlippageLimits,
        ) {}
        fn liquidate(
            ref self: ContractState,
            user: ContractAddress,
            pool_key: PoolKey,
            ekubo_limits: EkuboSlippageLimits,
        ) {}
    }

    #[abi(embed_v0)]
    impl Locker of ILocker<ContractState> {
        fn locked(ref self: ContractState, id: u32, data: Span<felt252>) -> Span<felt252> {
            let core = self.ekubo_core.read();
            let SwapData { pool_key, params, caller } = consume_callback_data(core, data);
            let delta = core.swap(pool_key, params);

            handle_delta(core, pool_key.token0, delta.amount0, caller);
            handle_delta(core, pool_key.token1, delta.amount1, caller);

            let mut arr: Array<felt252> = ArrayTrait::new();
            Serde::serialize(@delta, ref arr);
            arr.span()
        }
    }
}
