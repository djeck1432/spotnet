use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use starknet::{ContractAddress, contract_address_const, get_contract_address};
use margin::interface::{IMarginDispatcher};
use snforge_std::cheatcodes::execution_info::caller_address::{
    start_cheat_caller_address, stop_cheat_caller_address,
};
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};
use alexandria_math::fast_power::fast_power;

#[derive(Drop)]
pub struct MarginTestSuite {
    pub margin: IMarginDispatcher,
    pub token: IERC20Dispatcher,
    pub owner: ContractAddress,
}

pub fn ERC20_MOCK_CONTRACT() -> ContractAddress {
    contract_address_const::<'ERC20Mock'>()
}

pub fn deploy_erc20_mock() -> ContractAddress {
    let contract = declare("ERC20Mock").unwrap().contract_class();
    let name: ByteArray = "erc20 mock";
    let symbol: ByteArray = "ERC20MOCK";
    let initial_supply: u256 = 100 * fast_power(10, 18);
    let recipient: ContractAddress = get_contract_address();

    let mut calldata: Array<felt252> = array![];
    Serde::serialize(@name, ref calldata);
    Serde::serialize(@symbol, ref calldata);
    Serde::serialize(@initial_supply, ref calldata);
    Serde::serialize(@recipient, ref calldata);

    let (contract_addr, _) = contract.deploy_at(@calldata, ERC20_MOCK_CONTRACT()).unwrap();

    contract_addr
}

pub fn setup_test_suite(owner: ContractAddress, token_address: ContractAddress) -> MarginTestSuite {
    let contract = declare("Margin").unwrap().contract_class();

    let (margin_contract, _) = contract.deploy(@array![]).unwrap();

    MarginTestSuite {
        margin: IMarginDispatcher { contract_address: margin_contract },
        token: IERC20Dispatcher { contract_address: token_address },
        owner,
    }
}


pub fn setup_user(suite: @MarginTestSuite, user: ContractAddress, amount: u256) {
    // Transfer tokens to user
    (*suite.token).transfer(user, amount);

    start_cheat_caller_address(*suite.token.contract_address, user);
    (*suite.token).approve((*suite.margin).contract_address, amount);
    stop_cheat_caller_address(*suite.token.contract_address);
}
