#[starknet::contract]
pub mod PragmaMock {
    use margin::interface::{IPragmaOracle, IMockPragmaOracle, IERC20MetadataForPragmaDispatcher};
    use pragma_lib::types::{DataType, PragmaPricesResponse};
    use starknet::{storage::{StoragePointerWriteAccess, Map}, ContractAddress};
    use alexandria_math::{BitShift, U256BitShift};

    #[storage]
    struct Storage {
        pair_id: felt252,
        price: u128,
        decimals: u32,
        last_updated_timestamp: u64,
        num_sources_aggregated: u32,
        expiration_timestamp: Option<u64>,
        prices: Map<ContractAddress, u128>,
        // Store prices by pair_id directly
        pair_id_prices: Map<felt252, u128>,
    }

    #[abi(embed_v0)]
    impl IPragmaOracleImpl of IPragmaOracle<ContractState> {
        fn get_data_median(self: @ContractState, data_type: DataType) -> PragmaPricesResponse {
            if let DataType::SpotEntry(pair_id) = data_type {
                // Get price directly by pair_id
                let price = self.pair_id_prices.read(pair_id);
                assert(price != 0, 'Price not set for pair_id');

                return PragmaPricesResponse {
                    price: price,
                    decimals: 8,
                    last_updated_timestamp: 1234567890,
                    num_sources_aggregated: 1,
                    expiration_timestamp: Option::None,
                };
            }

            PragmaPricesResponse {
                price: 1_000000000000000000, // 1.0 with 18 decimals
                decimals: 18,
                last_updated_timestamp: 1234567890,
                num_sources_aggregated: 1,
                expiration_timestamp: Option::None,
            }
        }
    }

    #[abi(embed_v0)]
    impl IMockPragmaOracleImpl of IMockPragmaOracle<ContractState> {
        fn set_price(
            ref self: ContractState,
            pair_id: felt252,
            price: u128,
            decimals: u32,
            last_updated_timestamp: u64,
            num_sources_aggregated: u32,
            expiration_timestamp: Option<u64>,
        ) {
            self.pair_id.write(pair_id);
            self.price.write(price);
            self.decimals.write(decimals);
            self.last_updated_timestamp.write(last_updated_timestamp);
            self.num_sources_aggregated.write(num_sources_aggregated);
            self.expiration_timestamp.write(expiration_timestamp);

            // Store price by pair_id
            self.pair_id_prices.write(pair_id, price);
        }

        fn get_price(self: @ContractState, token: ContractAddress) -> u128 {
            let data = self.prices.read(token);
            assert(data != 0, 'MOCK_ORACLE_PRICE_NOT_SET');
            data
        }

        fn set_price_token(ref self: ContractState, token: ContractAddress, price: u128) -> () {
            // Store price by token address
            self.prices.write(token, price);

            // For simplicity in testing, we'll assume token symbol equals the contract address's
            // felt value This works in your test case where you use
            // contract_address_const::<'ETH'>() and contract_address_const::<'STRK'>()
            let token_as_felt: felt252 = token.into();

            // Generate pair_id using the symbol (which in test is the token address as felt)
            let token_symbol_u256: u256 = token_as_felt.into();
            let pair_id = BitShift::shl(token_symbol_u256, 32) + '/USD'.into();
            let pair_id_felt: felt252 = pair_id.try_into().expect('pair_id overflows');

            // Store price by pair_id
            self.pair_id_prices.write(pair_id_felt, price);
        }
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        // Initialize with default values
        self.price.write(1000000000000000000); // 1.0 with 18 decimals
        self.decimals.write(18);
        self.last_updated_timestamp.write(1234567890);
        self.num_sources_aggregated.write(1);
        self.expiration_timestamp.write(Option::None);
    }
}
