use ekubo::types::keys::PoolKey;
use spotnet::types::{MarketReserveData, SwapData, SwapResult, DepositData, Config, Claim};
use starknet::{ContractAddress};

#[starknet::interface]
pub trait IDeposit<TContractState> {
    fn swap(ref self: TContractState, swap_data: SwapData) -> SwapResult;

    fn loop_liquidity(
        ref self: TContractState,
        deposit_data: DepositData,
        pool_key: PoolKey,
        pool_price: felt252
    );

    fn close_position(
        ref self: TContractState,
        supply_token: ContractAddress,
        debt_token: ContractAddress,
        pool_key: PoolKey,
        supply_price: felt252,
        debt_price: felt252
    );

    fn claim_rewards(
        ref self: TContractState,
        claim_data: Claim,
        proofs: Span<felt252>,
        claim_contract: ContractAddress,
        reward_token: ContractAddress
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

#[starknet::interface]
pub trait IAirdrop<TContractState> {
    fn get_token(self: @TContractState) -> ContractAddress;
    fn get_config(self: @TContractState) -> Config;
    fn claim(ref self: TContractState, claim: Claim, proof: Span<felt252>) -> bool;
    fn claim_128(ref self: TContractState, claims: Span<Claim>, remaining_proof: Span<felt252>) -> u8;
    fn is_claimed(self: @TContractState, claim_id: u64) -> bool;
    fn refund(ref self: TContractState);
}
