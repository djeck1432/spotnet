use starknet::{ContractAddress};
use openzeppelin::token::erc20::interface::{IERC20DispatcherTrait};
use snforge_std::cheatcodes::execution_info::caller_address::{
    start_cheat_caller_address, stop_cheat_caller_address,
};
use margin::interface::{IMarginDispatcherTrait};
use super::utils::{
    setup_test_suite, deploy_erc20_mock, setup_user, get_treasury_balance, get_pool_value,
    deploy_pragma_mock, ERC20_MOCK_CONTRACT,
};
use super::constants::{HYPOTHETICAL_OWNER_ADDR, DEPOSIT_MOCK_USER, DEPOSIT_MOCK_USER_2};


#[test]
#[should_panic(expected: 'Amount is zero')]
fn test_deposit_zero_amount() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let zero_amount = 0_u256;

    // Set caller as the depositor
    start_cheat_caller_address(
        suite.margin.contract_address, DEPOSIT_MOCK_USER.try_into().unwrap(),
    );
    suite.margin.deposit(suite.token.contract_address, zero_amount);
    stop_cheat_caller_address(suite.margin.contract_address);
}

#[test]
#[should_panic(expected: 'Insufficient allowance')]
fn test_deposit_insufficient_allowance() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let deposit_amount: u256 = 1000;
    let user: ContractAddress = DEPOSIT_MOCK_USER.try_into().unwrap();

    // Transfer tokens to user but don't approve
    suite.token.transfer(user, deposit_amount);

    // Try to deposit without approval
    start_cheat_caller_address(suite.margin.contract_address, user);
    suite.margin.deposit(suite.token.contract_address, deposit_amount);
    stop_cheat_caller_address(suite.margin.contract_address);
}

#[test]
#[should_panic(expected: 'Insufficient balance')]
fn test_deposit_insufficient_balance() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let deposit_amount: u256 = 1000000000000000000000; // Very large amount
    let user: ContractAddress = DEPOSIT_MOCK_USER.try_into().unwrap();

    // Approve without having enough tokens
    start_cheat_caller_address(suite.token.contract_address, user);
    suite.token.approve(suite.margin.contract_address, deposit_amount);
    stop_cheat_caller_address(suite.token.contract_address);

    // Try to deposit
    start_cheat_caller_address(suite.margin.contract_address, user);
    suite.margin.deposit(suite.token.contract_address, deposit_amount);
    stop_cheat_caller_address(suite.margin.contract_address);
}

#[test]
fn test_deposit_success() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let deposit_amount: u256 = 1000;
    let user: ContractAddress = DEPOSIT_MOCK_USER.try_into().unwrap();

    setup_user(@suite, user, deposit_amount);

    // Get initial balances
    let initial_contract_balance = suite.token.balance_of(suite.margin.contract_address);
    let initial_user_balance = suite.token.balance_of(user);

    // Deposit
    start_cheat_caller_address(suite.margin.contract_address, user);
    suite.margin.deposit(suite.token.contract_address, deposit_amount);
    stop_cheat_caller_address(suite.margin.contract_address);

    // Check final balances
    let final_contract_balance = suite.token.balance_of(suite.margin.contract_address);
    let final_user_balance = suite.token.balance_of(user);

    assert(
        final_contract_balance == initial_contract_balance + deposit_amount,
        'Wrong contract balance',
    );
    assert(final_user_balance == initial_user_balance - deposit_amount, 'Wrong user balance');
}

#[test]
fn test_multiple_deposits() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let deposit_amount1: u256 = 1000;
    let deposit_amount2: u256 = 500;
    let user: ContractAddress = DEPOSIT_MOCK_USER.try_into().unwrap();

    setup_user(@suite, user, deposit_amount1 + deposit_amount2);

    // First deposit
    start_cheat_caller_address(suite.margin.contract_address, user);
    suite.margin.deposit(suite.token.contract_address, deposit_amount1);

    // Second deposit
    suite.margin.deposit(suite.token.contract_address, deposit_amount2);
    stop_cheat_caller_address(suite.margin.contract_address);

    // Check final balance
    let final_contract_balance = suite.token.balance_of(suite.margin.contract_address);
    assert(final_contract_balance == deposit_amount1 + deposit_amount2, 'Wrong total deposit');
}

#[test]
fn test_multiple_users_deposit() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let deposit_amount1: u256 = 1000;
    let deposit_amount2: u256 = 2000;
    let user1: ContractAddress = DEPOSIT_MOCK_USER.try_into().unwrap();
    let user2: ContractAddress = DEPOSIT_MOCK_USER_2.try_into().unwrap();

    setup_user(@suite, user1, deposit_amount1);
    setup_user(@suite, user2, deposit_amount2);

    // User 1 deposit
    start_cheat_caller_address(suite.margin.contract_address, user1);
    suite.margin.deposit(suite.token.contract_address, deposit_amount1);
    stop_cheat_caller_address(suite.margin.contract_address);

    // User 2 deposit
    start_cheat_caller_address(suite.margin.contract_address, user2);
    suite.margin.deposit(suite.token.contract_address, deposit_amount2);
    stop_cheat_caller_address(suite.margin.contract_address);

    // Check final balance
    let final_contract_balance = suite.token.balance_of(suite.margin.contract_address);
    assert(final_contract_balance == deposit_amount1 + deposit_amount2, 'Wrong total deposits');
}


#[test]
fn test_storage_updates() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let deposit_amount: u256 = 1000;
    let user: ContractAddress = DEPOSIT_MOCK_USER.try_into().unwrap();

    setup_user(@suite, user, deposit_amount);

    // Deposit
    start_cheat_caller_address(suite.margin.contract_address, user);
    suite.margin.deposit(suite.token.contract_address, deposit_amount);
    stop_cheat_caller_address(suite.margin.contract_address);

    // Check storage updates
    let treasury_balance = get_treasury_balance(
        suite.margin.contract_address, user, suite.token.contract_address,
    );

    let pool_value = get_pool_value(suite.margin.contract_address, suite.token.contract_address);

    assert(treasury_balance == deposit_amount, 'Wrong treasury balance');
    assert(pool_value == deposit_amount, 'Wrong pool value');
}
