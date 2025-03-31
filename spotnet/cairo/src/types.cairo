use ekubo::{interfaces::core::SwapParameters, types::{delta::Delta, keys::PoolKey}};
use starknet::ContractAddress;

pub type TokenPrice = u128;
pub type TokenAmount = u256;
pub type DecimalScale = u64;

#[derive(Copy, Drop, Serde)]
pub struct SwapResult {
    pub delta: Delta,
}

#[derive(Copy, Drop, Serde)]
pub struct SwapData {
    pub params: SwapParameters,
    pub pool_key: PoolKey,
    pub caller: ContractAddress
}

#[derive(Copy, Drop, Serde)]
pub struct DepositData {
    pub token: ContractAddress,
    pub amount: TokenAmount,
    pub multiplier: u8,
    pub borrow_portion_percent: u8
}

#[derive(Copy, Drop, Serde)]
pub struct EkuboSlippageLimits {
    pub lower: u256,
    pub upper: u256
}

#[derive(Copy, Drop, Serde)]
pub struct Claim {
    pub id: u64,
    pub claimee: ContractAddress,
    pub amount: u128
}

#[derive(Copy, Drop, Serde)]
pub struct VaultRepayData {
    pub vault: ContractAddress,
    pub amount: TokenAmount
}

#[derive(Drop, Serde, starknet::Store)]
pub struct MarketReserveData {
    pub enabled: bool,
    pub decimals: felt252,
    pub z_token_address: ContractAddress,
    interest_rate_model: ContractAddress,
    pub collateral_factor: felt252,
    pub borrow_factor: felt252,
    reserve_factor: felt252,
    last_update_timestamp: felt252,
    lending_accumulator: felt252,
    debt_accumulator: felt252,
    pub current_lending_rate: felt252,
    pub current_borrowing_rate: felt252,
    raw_total_debt: felt252,
    flash_loan_fee: felt252,
    liquidation_bonus: felt252,
    debt_limit: felt252
}

