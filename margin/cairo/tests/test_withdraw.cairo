use starknet::{ContractAddress};
use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use snforge_std::cheatcodes::execution_info::caller_address::{
    start_cheat_caller_address, stop_cheat_caller_address,
};
use margin::interface::{IMarginDispatcherTrait};
use super::utils::{
    setup_test_suite, deploy_erc20_mock, deploy_erc20_mock_2, setup_user, get_treasury_balance,
    get_pool_value, deploy_pragma_mock, ERC20_MOCK_CONTRACT,
};

const WITHDRAW_MOCK_USER: felt252 =
    0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5;
const WITHDRAW_MOCK_USER_2: felt252 = 0x1234;
const HYPOTHETICAL_OWNER_ADDR: felt252 =
    0x059a943ca214c10234b9a3b61c558ac20c005127d183b86a99a8f3c60a08b4ff;

#[test]
#[should_panic(expected: 'Withdraw amount is zero')]
fn test_withdraw_zero_amount() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let deposit_amount: u256 = 1000;
    let zero_amount: u256 = 0;
    let user: ContractAddress = WITHDRAW_MOCK_USER.try_into().unwrap();

    // First deposit some tokens
    setup_user(@suite, user, deposit_amount);
    start_cheat_caller_address(suite.margin.contract_address, user);
    suite.margin.deposit(suite.token.contract_address, deposit_amount);

    // Try to withdraw zero amount
    suite.margin.withdraw(suite.token.contract_address, zero_amount);
    stop_cheat_caller_address(suite.margin.contract_address);
}

#[test]
#[should_panic(expected: 'Insufficient user treasury')]
fn test_withdraw_insufficient_balance() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let deposit_amount: u256 = 1000;
    let withdraw_amount: u256 = 2000; // More than deposited
    let user: ContractAddress = WITHDRAW_MOCK_USER.try_into().unwrap();

    // First deposit some tokens
    setup_user(@suite, user, deposit_amount);
    start_cheat_caller_address(suite.margin.contract_address, user);
    suite.margin.deposit(suite.token.contract_address, deposit_amount);

    // Try to withdraw more than deposited
    suite.margin.withdraw(suite.token.contract_address, withdraw_amount);
    stop_cheat_caller_address(suite.margin.contract_address);
}

#[test]
fn test_withdraw_success() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let deposit_amount: u256 = 1000;
    let withdraw_amount: u256 = 500;
    let user: ContractAddress = WITHDRAW_MOCK_USER.try_into().unwrap();

    // First deposit some tokens
    setup_user(@suite, user, deposit_amount);
    start_cheat_caller_address(suite.margin.contract_address, user);
    suite.margin.deposit(suite.token.contract_address, deposit_amount);

    // Get initial balances
    let initial_contract_balance = suite.token.balance_of(suite.margin.contract_address);
    let initial_user_balance = suite.token.balance_of(user);

    // Withdraw
    suite.margin.withdraw(suite.token.contract_address, withdraw_amount);
    stop_cheat_caller_address(suite.margin.contract_address);

    // Check final balances
    let final_contract_balance = suite.token.balance_of(suite.margin.contract_address);
    let final_user_balance = suite.token.balance_of(user);

    assert(
        final_contract_balance == initial_contract_balance - withdraw_amount,
        'Wrong contract balance',
    );
    assert(final_user_balance == initial_user_balance + withdraw_amount, 'Wrong user balance');
}

#[test]
fn test_multiple_withdrawals() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let deposit_amount: u256 = 1000;
    let withdraw_amount1: u256 = 300;
    let withdraw_amount2: u256 = 400;
    let user: ContractAddress = WITHDRAW_MOCK_USER.try_into().unwrap();

    // First deposit some tokens
    setup_user(@suite, user, deposit_amount);
    start_cheat_caller_address(suite.margin.contract_address, user);
    suite.margin.deposit(suite.token.contract_address, deposit_amount);

    // Get initial balances
    let initial_user_balance = suite.token.balance_of(user);

    // First withdrawal
    suite.margin.withdraw(suite.token.contract_address, withdraw_amount1);

    // Second withdrawal
    suite.margin.withdraw(suite.token.contract_address, withdraw_amount2);
    stop_cheat_caller_address(suite.margin.contract_address);

    // Check final balances
    let final_user_balance = suite.token.balance_of(user);

    assert(
        final_user_balance == initial_user_balance + withdraw_amount1 + withdraw_amount2,
        'Wrong user balances',
    );
}

#[test]
fn test_withdraw_full_amount() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let deposit_amount: u256 = 1000;
    let user: ContractAddress = WITHDRAW_MOCK_USER.try_into().unwrap();

    // First deposit some tokens
    setup_user(@suite, user, deposit_amount);
    start_cheat_caller_address(suite.margin.contract_address, user);
    suite.margin.deposit(suite.token.contract_address, deposit_amount);

    // Withdraw the full amount
    suite.margin.withdraw(suite.token.contract_address, deposit_amount);
    stop_cheat_caller_address(suite.margin.contract_address);

    // Check treasury balance and pool value are both zero
    let treasury_balance = get_treasury_balance(
        suite.margin.contract_address, user, suite.token.contract_address,
    );

    let pool_value = get_pool_value(suite.margin.contract_address, suite.token.contract_address);

    assert(treasury_balance == 0, 'Treasury not empty');
    assert(pool_value == 0, 'Pool not empty');
}

#[test]
fn test_storage_updates_after_withdraw() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let deposit_amount: u256 = 1000;
    let withdraw_amount: u256 = 600;
    let user: ContractAddress = WITHDRAW_MOCK_USER.try_into().unwrap();

    // First deposit some tokens
    setup_user(@suite, user, deposit_amount);
    start_cheat_caller_address(suite.margin.contract_address, user);
    suite.margin.deposit(suite.token.contract_address, deposit_amount);

    // Get initial pool value
    let initial_pool_value = get_pool_value(
        suite.margin.contract_address, suite.token.contract_address,
    );

    // Withdraw
    suite.margin.withdraw(suite.token.contract_address, withdraw_amount);
    stop_cheat_caller_address(suite.margin.contract_address);

    // Check storage updates
    let treasury_balance = get_treasury_balance(
        suite.margin.contract_address, user, suite.token.contract_address,
    );

    let final_pool_value = get_pool_value(
        suite.margin.contract_address, suite.token.contract_address,
    );

    // Treasury balance should be updated
    assert(treasury_balance == deposit_amount - withdraw_amount, 'Wrong treasury balance');
    assert(final_pool_value == initial_pool_value - withdraw_amount, 'Wrong pool value');
}

#[test]
fn test_multiple_users_withdraw() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    let deposit_amount1: u256 = 1000;
    let deposit_amount2: u256 = 2000;
    let withdraw_amount1: u256 = 400;
    let withdraw_amount2: u256 = 1500;
    let user1: ContractAddress = WITHDRAW_MOCK_USER.try_into().unwrap();
    let user2: ContractAddress = WITHDRAW_MOCK_USER_2.try_into().unwrap();

    // Setup users and deposits
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

    // Get initial pool value
    let initial_pool_value = get_pool_value(
        suite.margin.contract_address, suite.token.contract_address,
    );

    // User 1 withdraw
    start_cheat_caller_address(suite.margin.contract_address, user1);
    suite.margin.withdraw(suite.token.contract_address, withdraw_amount1);
    stop_cheat_caller_address(suite.margin.contract_address);

    // User 2 withdraw
    start_cheat_caller_address(suite.margin.contract_address, user2);
    suite.margin.withdraw(suite.token.contract_address, withdraw_amount2);
    stop_cheat_caller_address(suite.margin.contract_address);

    // Check final pool value
    let final_pool_value = get_pool_value(
        suite.margin.contract_address, suite.token.contract_address,
    );

    assert(
        final_pool_value == initial_pool_value - withdraw_amount1 - withdraw_amount2,
        'Wrong final pool value',
    );
}

#[test]
fn test_withdraw_from_separate_pools() {
    // Setup
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );
    // Deploy a second token
    let token2_address = deploy_erc20_mock_2();

    let deposit_amount1: u256 = 1000;
    let deposit_amount2: u256 = 2000;
    let withdraw_amount1: u256 = 500;
    let withdraw_amount2: u256 = 1000;
    let user: ContractAddress = WITHDRAW_MOCK_USER.try_into().unwrap();

    // Setup user with both tokens
    setup_user(@suite, user, deposit_amount1);

    // Setup for second token
    let token2 = IERC20Dispatcher { contract_address: token2_address };
    token2.transfer(user, deposit_amount2);

    start_cheat_caller_address(token2_address, user);
    token2.approve(suite.margin.contract_address, deposit_amount2);
    stop_cheat_caller_address(token2_address);

    // Deposit both tokens
    start_cheat_caller_address(suite.margin.contract_address, user);
    suite.margin.deposit(suite.token.contract_address, deposit_amount1);
    suite.margin.deposit(token2_address, deposit_amount2);

    // Get initial pool values
    let initial_pool1_value = get_pool_value(
        suite.margin.contract_address, suite.token.contract_address,
    );
    let initial_pool2_value = get_pool_value(suite.margin.contract_address, token2_address);

    // Withdraw from both pools
    suite.margin.withdraw(suite.token.contract_address, withdraw_amount1);
    suite.margin.withdraw(token2_address, withdraw_amount2);
    stop_cheat_caller_address(suite.margin.contract_address);

    // Check final pool values
    let final_pool1_value = get_pool_value(
        suite.margin.contract_address, suite.token.contract_address,
    );
    let final_pool2_value = get_pool_value(suite.margin.contract_address, token2_address);

    assert(final_pool1_value == initial_pool1_value - withdraw_amount1, 'Wrong pool1 value');
    assert(final_pool2_value == initial_pool2_value - withdraw_amount2, 'Wrong pool2 value');
}
