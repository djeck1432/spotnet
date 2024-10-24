use ekubo::types::keys::PoolKey;
use spotnet::types::{MarketReserveData, DepositData};
use starknet::{ContractAddress};

#[starknet::interface]
pub trait IDeposit<TContractState> {
    fn loop_liquidity(
        ref self: TContractState,
        deposit_data: DepositData,
        pool_key: PoolKey,
        pool_price: u256,
        usdc_price: u256
    );

    fn close_position(
        ref self: TContractState,
        supply_token: ContractAddress,
        debt_token: ContractAddress,
        pool_key: PoolKey,
        supply_price: u256,
        debt_price: u256
    );
}

#[starknet::interface]
pub trait IMarket<TContractState> {
    fn get_reserve_data(self: @TContractState, token: ContractAddress) -> MarketReserveData;
    fn get_user_debt_for_token(
        self: @TContractState, user: ContractAddress, token: ContractAddress
    ) -> felt252;

    fn deposit(ref self: TContractState, token: ContractAddress, amount: felt252);
    fn borrow(ref self: TContractState, token: ContractAddress, amount: felt252);
    fn enable_collateral(ref self: TContractState, token: ContractAddress);
    fn disable_collateral(ref self: TContractState, token: ContractAddress);
    fn withdraw(ref self: TContractState, token: ContractAddress, amount: felt252);
    fn withdraw_all(ref self: TContractState, token: ContractAddress);
    fn repay(ref self: TContractState, token: ContractAddress, amount: felt252);
    fn repay_all(ref self: TContractState, token: ContractAddress);
}
