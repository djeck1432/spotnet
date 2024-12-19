use openzeppelin::token::erc20::interface::IERC20Dispatcher;
use spotnet::interfaces::IVaultDispatcher;
use starknet::ContractAddress;

#[derive(Drop)]
pub struct VaultTestSuite {
    pub vault: IVaultDispatcher,
    pub token: IERC20Dispatcher,
    pub owner: ContractAddress,
}
