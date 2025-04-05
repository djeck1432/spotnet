use starknet::ContractAddress;
use ekubo::{interfaces::core::SwapParameters, types::keys::PoolKey};

pub type TokenAmount = u256;
pub type Timestamp = u128;

#[derive(Serde, Drop)]
pub struct PositionParameters {
    pub initial_token: ContractAddress,
    pub debt_token: ContractAddress,
    pub amount: TokenAmount,
}

#[derive(Serde, starknet::Store, Drop)]
pub struct Position {
    pub initial_token: ContractAddress,
    pub debt_token: ContractAddress,
    pub traded_amount: TokenAmount,
    pub debt: TokenAmount,
    pub is_open: bool,
    pub open_time: Timestamp,
}

impl PositionIntoSpan of Into<Position, Span<felt252>> {
    fn into(self: Position) -> Span<felt252> {
        let mut serialized_struct: Array<felt252> = array![];
        self.serialize(ref serialized_struct);
        serialized_struct.span()
    }
}

#[derive(Copy, Serde, Drop)]
pub struct SwapData {
    pub params: SwapParameters,
    pub pool_key: PoolKey,
    pub caller: ContractAddress,
}

#[derive(Copy, Drop, Serde)]
pub struct EkuboSlippageLimits {
    pub lower: u256,
    pub upper: u256,
}
