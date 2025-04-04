use starknet::{ContractAddress};
use snforge_std::cheatcodes::execution_info::caller_address::{
    start_cheat_caller_address, stop_cheat_caller_address,
};
use margin::interface::{IMarginDispatcherTrait};
use super::utils::{setup_test_suite, deploy_erc20_mock, get_risk_factor, deploy_pragma_mock};
use super::constants::{HYPOTHETICAL_OWNER_ADDR, DEPOSIT_MOCK_USER};

#[test]
#[should_panic(expected: 'Caller is not the owner')]
fn test_set_risk_not_owner() {
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(), deploy_erc20_mock(), deploy_pragma_mock(),
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(), deploy_erc20_mock(), deploy_pragma_mock(),
    );

    start_cheat_caller_address(
        suite.margin.contract_address, DEPOSIT_MOCK_USER.try_into().unwrap(),
    );
    suite.margin.set_risk_factor(suite.token.contract_address, 5);
    stop_cheat_caller_address(suite.margin.contract_address);
}

#[test]
#[should_panic(expected: 'Incorrect risk factor')]
fn test_set_risk_less_than() {
    let owner: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let risk_factor: u128 = 10000000000000000000000000;
    let suite = setup_test_suite(owner, deploy_erc20_mock(), deploy_pragma_mock());
    let suite = setup_test_suite(owner, deploy_erc20_mock(), deploy_pragma_mock());

    start_cheat_caller_address(suite.margin.contract_address, owner);
    suite.margin.set_risk_factor(suite.token.contract_address, risk_factor);
    stop_cheat_caller_address(suite.margin.contract_address);
}

#[test]
#[should_panic(expected: 'Incorrect risk factor')]
fn test_set_risk_more_than() {
    let owner: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let risk_factor: u128 = 1100000000000000000000000000;
    let suite = setup_test_suite(owner, deploy_erc20_mock(), deploy_pragma_mock());
    let suite = setup_test_suite(owner, deploy_erc20_mock(), deploy_pragma_mock());

    start_cheat_caller_address(suite.margin.contract_address, owner);
    suite.margin.set_risk_factor(suite.token.contract_address, risk_factor);
    stop_cheat_caller_address(suite.margin.contract_address);
}

#[test]
fn test_set_risk_ok() {
    let owner: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let risk_factor: u128 = 500000000000000000000000000;
    let suite = setup_test_suite(owner, deploy_erc20_mock(), deploy_pragma_mock());
    let suite = setup_test_suite(owner, deploy_erc20_mock(), deploy_pragma_mock());

    start_cheat_caller_address(suite.margin.contract_address, owner);
    suite.margin.set_risk_factor(suite.token.contract_address, risk_factor);
    stop_cheat_caller_address(suite.margin.contract_address);

    let risk_factor_from_storage = get_risk_factor(suite.margin.contract_address, suite.token.contract_address);
    assert(risk_factor_from_storage == risk_factor, 'Risk factor incorrect');
}
