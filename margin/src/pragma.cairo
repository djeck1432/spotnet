use pragma_lib::types::{AggregationMode, DataType, PragmaPricesResponse};
// #[derive(Serde, Drop, Copy)]
// struct PragmaPricesResponse {
//     price: u128,
//     decimals: u32,
//     last_updated_timestamp: u64,
//     num_sources_aggregated: u32,
//     expiration_timestamp: Option<u64>,
// }

pub fn mock_get_data_median(price: u128, data_type: DataType) -> PragmaPricesResponse {
    PragmaPricesResponse {
        price,
        decimals: 18,
        last_updated_timestamp: 1,
        num_sources_aggregated: 1,
        expiration_timestamp: Option::None,
    }
}
