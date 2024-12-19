use openzeppelin::token::erc20::interface::IERC20DispatcherTrait;
use openzeppelin_token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
use snforge_std::cheatcodes::execution_info::caller_address::{
    start_cheat_caller_address, stop_cheat_caller_address
};
use snforge_std::{load, map_entry_address};
use spotnet::interfaces::{IVaultDispatcherTrait, IMarketDispatcher, IMarketDispatcherTrait};

use starknet::ContractAddress;
use super::constants::{HYPOTHETICAL_OWNER_ADDR, tokens, contracts};
use super::utils::{
    setup_test_suite, setup_user, assert_vault_amount, deploy_deposit_contract, setup_test_deposit,
    deploy_erc20_mock
};

const MOCK_USER: felt252 = 0x1234;
const MOCK_USER_2: felt252 = 0x5678;
const DEPOSIT_MOCK_USER: felt252 =
    0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5;

#[test]
fn test_deploy() {
    let suite = setup_test_suite(HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(), deploy_erc20_mock());
    let token = load(suite.vault.contract_address, selector!("token"), 1,);

    assert!(*token[0] == suite.token.contract_address.try_into().unwrap(), "token not match");
}

#[test]
fn test_store_and_withdraw_liquidity_happy_path() {
    let suite = setup_test_suite(HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(), deploy_erc20_mock());
    let user1: ContractAddress = MOCK_USER.try_into().unwrap();
    let amount: u256 = 100;

    setup_user(@suite, user1, amount);

    start_cheat_caller_address(suite.vault.contract_address, user1);
    suite.vault.store_liquidity(amount);
    stop_cheat_caller_address(suite.vault.contract_address);

    // Check stored balance
    assert_vault_amount(suite.vault.contract_address, user1, 100);

    // Withdraw 50
    start_cheat_caller_address(suite.vault.contract_address, user1);
    suite.vault.withdraw_liquidity(50);
    stop_cheat_caller_address(suite.vault.contract_address);

    // Check remaining balance
    assert_vault_amount(suite.vault.contract_address, user1, 50);
}


#[test]
fn test_store_and_withdraw_multiple_users() {
    let suite = setup_test_suite(HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(), deploy_erc20_mock());
    let user1: ContractAddress = MOCK_USER.try_into().unwrap();
    let user2: ContractAddress = MOCK_USER_2.try_into().unwrap();

    let user1_amount: u256 = 100;
    let user2_amount: u256 = 150;

    // Setup both users
    setup_user(@suite, user1, user1_amount);
    setup_user(@suite, user2, user2_amount);

    // User 1 stores and withdraws
    start_cheat_caller_address(suite.vault.contract_address, user1);
    suite.vault.store_liquidity(user1_amount);
    suite.vault.withdraw_liquidity(30);
    stop_cheat_caller_address(suite.vault.contract_address);

    // User 2 stores and withdraws
    start_cheat_caller_address(suite.vault.contract_address, user2);
    suite.vault.store_liquidity(user2_amount);
    suite.vault.withdraw_liquidity(50);
    stop_cheat_caller_address(suite.vault.contract_address);

    // Check final balances of both users
    assert_vault_amount(suite.vault.contract_address, user1, 70);
    assert_vault_amount(suite.vault.contract_address, user2, 100);
}

#[test]
#[should_panic(expected: ('Approved amount insufficient',))]
fn test_insufficient_allowance() {
    let suite = setup_test_suite(HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(), deploy_erc20_mock());
    let user1: ContractAddress = MOCK_USER.try_into().unwrap();
    let user_amount: u256 = 100;
    let approved_amount: u256 = 50; // less than needed

    suite.token.transfer(user1, user_amount);

    start_cheat_caller_address(suite.token.contract_address, user1);
    suite.token.approve(suite.vault.contract_address, approved_amount);
    stop_cheat_caller_address(suite.token.contract_address);

    // Should fail when trying to store more than approved
    start_cheat_caller_address(suite.vault.contract_address, user1);
    suite.vault.store_liquidity(user_amount);
    stop_cheat_caller_address(suite.vault.contract_address);
}

#[test]
#[should_panic(expected: ('Not enough tokens to withdraw',))]
fn test_insufficient_balance_withdraw() {
    let suite = setup_test_suite(HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(), deploy_erc20_mock());
    let user1: ContractAddress = MOCK_USER.try_into().unwrap();

    start_cheat_caller_address(suite.vault.contract_address, user1);
    suite.vault.withdraw_liquidity(100);
    stop_cheat_caller_address(suite.vault.contract_address);
}

#[test]
fn test_add_deposit_contract() {
    let suite = setup_test_suite(HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(), deploy_erc20_mock());
    let user: ContractAddress = MOCK_USER.try_into().unwrap();
    let deposit_address: ContractAddress = deploy_deposit_contract(user);

    start_cheat_caller_address(suite.vault.contract_address, user);
    suite.vault.add_deposit_contract(deposit_address);
    // Check activeContracts
    let activeContracts_after_adding = load(
        suite.vault.contract_address,
        map_entry_address(selector!("activeContracts"), array![user.try_into().unwrap()].span()),
        1,
    );

    stop_cheat_caller_address(suite.vault.contract_address);
    assert(
        (*activeContracts_after_adding[0]).try_into().unwrap() == deposit_address,
        'Deposit contract mismatch'
    );
}

#[test]
#[should_panic(expected: ('Deposit contract is zero',))]
fn test_add_deposit_contract_address_is_zero() {
    let suite = setup_test_suite(HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(), deploy_erc20_mock());
    let user: ContractAddress = MOCK_USER.try_into().unwrap();
    let deposit_address: ContractAddress = 0.try_into().unwrap();

    start_cheat_caller_address(suite.vault.contract_address, user);
    suite.vault.add_deposit_contract(deposit_address);
    stop_cheat_caller_address(suite.vault.contract_address);
}

#[test]
#[fork("MAINNET")]
fn test_protect_position_with_owner() {
    let user_amount: u256 = 685000000000000;
    let withdrawn_amount: u256 = 1000000;
    let user = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let token = tokens::ETH.try_into().unwrap();
    let mut suite = setup_test_suite(user, token);
    let deposit_address = setup_test_deposit(ref suite, user, user_amount);

    start_cheat_caller_address(suite.vault.contract_address, user);
    suite.vault.protect_position(deposit_address, user, withdrawn_amount);
    stop_cheat_caller_address(suite.vault.contract_address);

    let expected_amount_vault: felt252 = (user_amount - withdrawn_amount).try_into().unwrap();
    assert_vault_amount(suite.vault.contract_address, user, expected_amount_vault);

    let z_token_address = IMarketDispatcher {
        contract_address: contracts::ZKLEND_MARKET.try_into().unwrap()
    }
        .get_reserve_data(token)
        .z_token_address;
    let deposit_balance: u256 = ERC20ABIDispatcher { contract_address: z_token_address }
        .balanceOf(deposit_address);

    println!("Deposit {}", deposit_balance);

    assert(deposit_balance >= user_amount, 'Deposit amount mismatch');
}

#[test]
#[fork("MAINNET")]
fn test_protect_position_with_user() {
    let owner_amount: u256 = 685000000000000;
    let user_amount: u256 = 675000000000000;
    let withdrawn_amount: u256 = 1000000;
    let owner = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let user = DEPOSIT_MOCK_USER.try_into().unwrap();
    let token = tokens::ETH.try_into().unwrap();

    let mut suite_owner = setup_test_suite(owner, token);
    let _deposit_address_owner = setup_test_deposit(ref suite_owner, owner, owner_amount);
    let mut suite_user = setup_test_suite(user, token);
    let deposit_address_user = setup_test_deposit(ref suite_user, user, user_amount);

    start_cheat_caller_address(suite_owner.vault.contract_address, owner);
    suite_owner.vault.protect_position(deposit_address_user, owner, withdrawn_amount);
    stop_cheat_caller_address(suite_owner.vault.contract_address);

    let expected_amount_owner: felt252 = (owner_amount - withdrawn_amount).try_into().unwrap();
    assert_vault_amount(suite_owner.vault.contract_address, owner, expected_amount_owner);

    let z_token_address = IMarketDispatcher {
        contract_address: contracts::ZKLEND_MARKET.try_into().unwrap()
    }
        .get_reserve_data(token)
        .z_token_address;
    let deposit_balance: u256 = ERC20ABIDispatcher { contract_address: z_token_address }
        .balanceOf(deposit_address_user);

    println!("Deposit {}", deposit_balance);

    assert(deposit_balance >= user_amount, 'Deposit amount mismatch');
}

#[test]
#[fork("MAINNET")]
#[should_panic(expected: ('Caller must be owner or user',))]
fn test_protect_position_panic_on_caller() {
    let caller_amount: u256 = 685000000000000;
    let withdrawn_amount: u256 = 1000000;
    let caller = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let owner = MOCK_USER.try_into().unwrap();
    let user2 = MOCK_USER_2.try_into().unwrap();
    let mut suite = setup_test_suite(owner, deploy_erc20_mock());
    setup_user(@suite, caller, caller_amount);
    let deposit_address = setup_test_deposit(ref suite, caller, caller_amount);

    start_cheat_caller_address(suite.vault.contract_address, caller);
    suite.vault.protect_position(deposit_address, user2, withdrawn_amount);
    stop_cheat_caller_address(suite.vault.contract_address);
}

#[test]
#[fork("MAINNET")]
#[should_panic(expected: ('Insufficient balance!',))]
fn test_protect_position_insufficient_balance() {
    let user_amount: u256 = 685000000000000;
    let user = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let mut suite = setup_test_suite(user, tokens::ETH.try_into().unwrap());
    let deposit_address = setup_test_deposit(ref suite, user, user_amount);

    start_cheat_caller_address(suite.vault.contract_address, user);
    suite.vault.protect_position(deposit_address, user, user_amount + 10000);
    stop_cheat_caller_address(suite.vault.contract_address);
}

#[test]
#[should_panic(expected: ('Deposit contract is zero',))]
fn test_protect_position_deposit_contract_is_zero() {
    let user_amount: u256 = 685000000000000;
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let suite = setup_test_suite(user, deploy_erc20_mock());
    let deposit_address: ContractAddress = 0.try_into().unwrap();

    start_cheat_caller_address(suite.vault.contract_address, user);
    suite.vault.protect_position(deposit_address, user, user_amount);
    stop_cheat_caller_address(suite.vault.contract_address);
}


#[test]
#[should_panic(expected: ('User address is zero',))]
fn test_protect_position_user_address_is_zero() {
    let suite = setup_test_suite(HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(), deploy_erc20_mock());
    let user_amount: u256 = 685000000000000;
    let user: ContractAddress = 0.try_into().unwrap();
    let deposit_address: ContractAddress = tokens::ETH.try_into().unwrap();

    start_cheat_caller_address(suite.vault.contract_address, user);
    suite.vault.protect_position(deposit_address, user, user_amount);
    stop_cheat_caller_address(suite.vault.contract_address);
}
