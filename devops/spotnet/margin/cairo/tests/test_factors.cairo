use starknet::ContractAddress;
use snforge_std::cheatcodes::execution_info::caller_address::{
    start_cheat_caller_address, stop_cheat_caller_address
};
use margin::interface::IMarginDispatcherTrait;
use super::utils::{
    setup_test_suite, deploy_erc20_mock_2, get_risk_factor, 
    deploy_pragma_mock, calculate_health_factor,
    store_data_for_health_factor
};
use super::constants::{HYPOTHETICAL_OWNER_ADDR, DEPOSIT_MOCK_USER};


#[test]
#[should_panic(expected: 'Caller is not the owner')]
fn test_set_risk_not_owner() {
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(), deploy_erc20_mock_2(), deploy_pragma_mock(),
    );

    start_cheat_caller_address(
        suite.margin.contract_address, DEPOSIT_MOCK_USER.try_into().unwrap(),
    );
    suite.margin.set_risk_factor(suite.token.contract_address, 5);
    stop_cheat_caller_address(suite.margin.contract_address);
}


#[test]
#[should_panic(expected: 'Risk factor less than needed')]
fn test_set_risk_less_than() {
    let owner: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let risk_factor: u128 = 10000000000000000000000000;
    let suite = setup_test_suite(owner, deploy_erc20_mock_2(), deploy_pragma_mock());

    start_cheat_caller_address(suite.margin.contract_address, owner);
    suite.margin.set_risk_factor(suite.token.contract_address, risk_factor);
    stop_cheat_caller_address(suite.margin.contract_address);
}


#[test]
#[should_panic(expected: 'Risk factor more than needed')]
fn test_set_risk_more_than() {
    let owner: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let risk_factor: u128 = 1100000000000000000000000000;
    let suite = setup_test_suite(owner, deploy_erc20_mock_2(), deploy_pragma_mock());

    start_cheat_caller_address(suite.margin.contract_address, owner);
    suite.margin.set_risk_factor(suite.token.contract_address, risk_factor);
    stop_cheat_caller_address(suite.margin.contract_address);
}


#[test]
fn test_set_risk_ok() {
    let owner: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let risk_factor: u128 = 500000000000000000000000000;
    let suite = setup_test_suite(owner, deploy_erc20_mock_2(), deploy_pragma_mock());

    start_cheat_caller_address(suite.margin.contract_address, owner);
    suite.margin.set_risk_factor(suite.token.contract_address, risk_factor);
    stop_cheat_caller_address(suite.margin.contract_address);

    let risk_factor_from_storage = get_risk_factor(suite.margin.contract_address, suite.token.contract_address);
    assert(risk_factor_from_storage == risk_factor, 'Risk factor incorrect');
}

#[test]
fn test_get_health_factor() {
    let owner: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let risk_factor: u128 = 500000000000000000000000000;
    let suite = setup_test_suite(owner, deploy_erc20_mock_2(), deploy_pragma_mock());

    store_data_for_health_factor(@suite, risk_factor);

    // Get health factor
    start_cheat_caller_address(suite.margin.contract_address, owner);
    let health_factor = suite.margin.get_health_factor(owner);
    stop_cheat_caller_address(suite.margin.contract_address);

    assert(health_factor == calculate_health_factor(@suite, risk_factor), 'Health factor incorrect');
}
