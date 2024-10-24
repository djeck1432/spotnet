use ekubo::interfaces::core::SwapParameters;
use ekubo::types::delta::Delta;
use ekubo::types::keys::PoolKey;
use starknet::ContractAddress;

pub type TokenPrice = u256;
pub type TokenAmount = u256;
pub type Decimals = u64;

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
    pub multiplier: u32
}

#[derive(Drop, Serde, starknet::Store)]
pub struct MarketReserveData {
    enabled: bool,
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
