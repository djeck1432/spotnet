use ekubo::types::keys::PoolKey;
use spotnet::types::{
    MarketReserveData, DepositData, Claim, EkuboSlippageLimits, TokenPrice, TokenAmount, VaultRepayData
};
use starknet::ContractAddress;

#[starknet::interface]
pub trait IDeposit<TContractState> {
    fn loop_liquidity(
        ref self: TContractState,
        deposit_data: DepositData,
        pool_key: PoolKey,
        ekubo_limits: EkuboSlippageLimits,
        pool_price: TokenPrice
    );

    fn close_position(
        ref self: TContractState,
        supply_token: ContractAddress,
        debt_token: ContractAddress,
        pool_key: PoolKey,
        ekubo_limits: EkuboSlippageLimits,
        borrow_portion_percent: u8,
        supply_price: TokenPrice,
        debt_price: TokenPrice,
        repay_vaults: Span<VaultRepayData>
    );

    fn claim_reward(
        ref self: TContractState,
        claim_data: Claim,
        proof: Span<felt252>,
        airdrop_addr: ContractAddress
    );

    fn extra_deposit(ref self: TContractState, token: ContractAddress, amount: TokenAmount);

    fn withdraw(ref self: TContractState, token: ContractAddress, amount: TokenAmount);

    fn is_position_open(self: @TContractState) -> bool;
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
    fn claim(ref self: TContractState, claim: Claim, proof: Span<felt252>) -> bool;
}

#[starknet::interface]
pub trait IVault<TContractState> {
    fn store_liquidity(ref self: TContractState, amount: TokenAmount);
    fn withdraw_liquidity(ref self: TContractState, amount: TokenAmount);
    fn add_deposit_contract(ref self: TContractState, deposit_contract: ContractAddress);
    fn protect_position(
        ref self: TContractState,
        deposit_contract: ContractAddress,
        user: ContractAddress,
        amount: TokenAmount
    );
    fn return_liquidity(ref self: TContractState, user: ContractAddress, amount: TokenAmount);
    fn get_vault_token(self: @TContractState) -> ContractAddress;
}

