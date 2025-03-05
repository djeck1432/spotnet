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

    fn liquidate(ref self: TContractState, user: ContractAddress);

    fn get_asset_data(ref self: TContractState, token: ContractAddress) -> PragmaPricesResponse;
}

#[starknet::interface]
pub trait IERC20MetadataForPragma<TContractState> {
    fn name(self: @TContractState) -> ByteArray;
    fn symbol(self: @TContractState) -> felt252;
    fn decimals(self: @TContractState) -> felt252;
}
