#[starknet::contract]
pub mod PragmaMock {
    use starknet::ContractAddress;

    use margin::interface::{IPragmaOracle, IMockPragmaOracle};
    use pragma_lib::types::{AggregationMode, DataType, PragmaPricesResponse};

    #[storage]
    struct Storage {
        pair_id: felt252,
        price: u128,
        decimals: u32,
        last_updated_timestamp: u64,
        num_sources_aggregated: u32,
        expiration_timestamp: Option<u64>,
    }

    #[abi(embed_v0)]
    impl IPragmaOracleImpl of IPragmaOracle<ContractState> {
        fn get_data_median(self: @ContractState, data_type: DataType) -> PragmaPricesResponse {
            // Return mock data regardless of input
            PragmaPricesResponse {
                price: 1000000000000000000, // 1.0 with 18 decimals
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
        }
    }
}
