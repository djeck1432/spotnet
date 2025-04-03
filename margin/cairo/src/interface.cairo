use starknet::ContractAddress;
use crate::types::{TokenAmount, PositionParameters, EkuboSlippageLimits};
use pragma_lib::types::{AggregationMode, DataType, PragmaPricesResponse};
use ekubo::types::keys::PoolKey;

#[starknet::interface]
pub trait IMargin<TContractState> {
    fn deposit(ref self: TContractState, token: ContractAddress, amount: TokenAmount);
    fn withdraw(ref self: TContractState, token: ContractAddress, amount: TokenAmount);

    // TODO: Add Ekubo data for swap
    fn open_margin_position(
        ref self: TContractState,
        position_parameters: PositionParameters,
        pool_key: PoolKey,
        ekubo_limits: EkuboSlippageLimits,
    );
    fn close_position(
        ref self: TContractState, pool_key: PoolKey, ekubo_limits: EkuboSlippageLimits,
    );

    fn liquidate(
        ref self: TContractState,
        user: ContractAddress,
        pool_key: PoolKey,
        ekubo_limits: EkuboSlippageLimits,
    );
}

#[starknet::interface]
pub trait IERC20MetadataForPragma<TContractState> {
    fn name(self: @TContractState) -> ByteArray;
    fn symbol(self: @TContractState) -> felt252;
    fn decimals(self: @TContractState) -> felt252;
}

#[starknet::interface]
pub trait IPragmaOracle<TContractState> {
    fn get_data_median(self: @TContractState, data_type: DataType) -> PragmaPricesResponse;
}

#[starknet::interface]
pub trait IMockPragmaOracle<TContractState> {
    //
    // External
    //

    fn set_price(
        ref self: TContractState,
        pair_id: felt252,
        price: u128,
        decimals: u32,
        last_updated_timestamp: u64,
        num_sources_aggregated: u32,
        expiration_timestamp: Option<u64>,
    );

    fn get_price(self: @TContractState, token: ContractAddress) -> u128;
    fn set_price_token(ref self: TContractState, token: ContractAddress, price: u128);
}

