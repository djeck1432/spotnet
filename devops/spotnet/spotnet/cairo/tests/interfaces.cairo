use spotnet::types::MarketReserveData;
use starknet::ContractAddress;

#[starknet::interface]
pub trait IMarketTesting<TContractState> {
    fn get_reserve_data(self: @TContractState, token: ContractAddress) -> MarketReserveData;
    fn get_user_debt_for_token(
        self: @TContractState, user: ContractAddress, token: ContractAddress
    ) -> felt252;

    fn liquidate(
        ref self: TContractState,
        user: ContractAddress,
        debt_token: ContractAddress,
        amount: felt252,
        collateral_token: ContractAddress
    );
}
