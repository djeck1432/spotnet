use alexandria_math::fast_power::fast_power;
use ekubo::interfaces::core::{ICoreDispatcher, ICoreDispatcherTrait};
use ekubo::types::keys::PoolKey;
use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use pragma_lib::abi::{IPragmaABIDispatcher, IPragmaABIDispatcherTrait};
use pragma_lib::types::{AggregationMode, DataType, PragmaPricesResponse};
use snforge_std::cheatcodes::execution_info::account_contract_address::{
    start_cheat_account_contract_address, stop_cheat_account_contract_address
};
use snforge_std::cheatcodes::execution_info::caller_address::{
    start_cheat_caller_address, stop_cheat_caller_address
};
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait, load, map_entry_address};
use spotnet::interfaces::IVaultDispatcher;
use spotnet::interfaces::{IVaultDispatcherTrait, IDepositDispatcherTrait, IDepositDispatcher};
use spotnet::types::{DepositData, EkuboSlippageLimits};
use starknet::{ContractAddress, contract_address_const, get_contract_address};
use super::constants::{contracts, tokens, pool_key};
use super::types::VaultTestSuite;

pub fn ERC20_MOCK_CONTRACT() -> ContractAddress {
    contract_address_const::<'erc20mock'>()
}

pub fn get_asset_price_pragma(pair: felt252) -> u128 {
    let oracle_dispatcher = IPragmaABIDispatcher {
        contract_address: contracts::PRAGMA_ADDRESS.try_into().unwrap()
    };
    let output: PragmaPricesResponse = oracle_dispatcher
        .get_data(DataType::SpotEntry(pair), AggregationMode::Median(()));
    output.price / 100 // Make 6 decimals wide instead of 8.
}

pub fn get_slippage_limits(pool_key: PoolKey) -> EkuboSlippageLimits {
    let ekubo_core = ICoreDispatcher {
        contract_address: contracts::EKUBO_CORE_MAINNET.try_into().unwrap()
    };
    let sqrt_ratio = ekubo_core.get_pool_price(pool_key).sqrt_ratio;
    let tolerance = sqrt_ratio * 15 / 100;
    EkuboSlippageLimits { lower: sqrt_ratio - tolerance, upper: sqrt_ratio + tolerance }
}

pub fn deploy_erc20_mock() -> ContractAddress {
    let contract = declare("SnakeERC20Mock").unwrap().contract_class();
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

pub fn setup_test_suite(owner: ContractAddress, token_address: ContractAddress) -> VaultTestSuite {
    let contract = declare("Vault").unwrap().contract_class();

    let (vault_address, _) = contract
        .deploy(@array![owner.try_into().unwrap(), token_address.try_into().unwrap()])
        .unwrap();

    VaultTestSuite {
        vault: IVaultDispatcher { contract_address: vault_address },
        token: IERC20Dispatcher { contract_address: token_address },
        owner,
    }
}

pub fn setup_user(suite: @VaultTestSuite, user: ContractAddress, amount: u256) {
    // Transfer tokens to user
    (*suite.token).transfer(user, amount);

    start_cheat_caller_address(*suite.token.contract_address, user);
    (*suite.token).approve((*suite.vault).contract_address, amount);
    stop_cheat_caller_address(*suite.token.contract_address);
}

pub fn assert_vault_amount(
    vault: ContractAddress, user: ContractAddress, expected_amount: felt252
) {
    // Check remaining balance
    let balance_after_withdraw = load(
        vault, map_entry_address(selector!("amounts"), array![user.try_into().unwrap()].span()), 2,
    );
    assert(*balance_after_withdraw[0] == expected_amount, 'balance mismatch');
}

pub fn deploy_deposit_contract(user: ContractAddress) -> ContractAddress {
    let deposit_contract = declare("Deposit").unwrap().contract_class();
    let (deposit_address, _) = deposit_contract
        .deploy(
            @array![
                user.try_into().unwrap(),
                contracts::EKUBO_CORE_MAINNET,
                contracts::ZKLEND_MARKET,
                contracts::TREASURY_ADDRESS
            ]
        )
        .expect('Deploy failed');
    deposit_address
}

pub fn setup_test_deposit(
    ref suite: VaultTestSuite, user: ContractAddress, amount: u256
) -> ContractAddress {
    let deposit_address: ContractAddress = deploy_deposit_contract(user);
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };

    let pool_price = get_asset_price_pragma('ETH/USD').into();
    let deposit_data = DepositData {
        token: eth_addr, amount: amount, multiplier: 40, borrow_portion_percent: 98
    };
    let ekubo_limits = get_slippage_limits(pool_key);

    start_cheat_caller_address(deposit_data.token, user);
    IERC20Dispatcher { contract_address: deposit_data.token }
        .approve(suite.vault.contract_address, amount);
    stop_cheat_caller_address(deposit_data.token);

    start_cheat_caller_address(suite.vault.contract_address, user);
    suite.vault.store_liquidity(amount);
    stop_cheat_caller_address(suite.vault.contract_address);

    start_cheat_caller_address(deposit_data.token, user);
    IERC20Dispatcher { contract_address: deposit_data.token }.approve(deposit_address, amount);
    stop_cheat_caller_address(deposit_data.token);

    start_cheat_account_contract_address(deposit_address, user);
    IDepositDispatcher { contract_address: deposit_address }
        .loop_liquidity(deposit_data, pool_key, ekubo_limits, pool_price);
    stop_cheat_account_contract_address(deposit_address);

    deposit_address
}

pub fn assert_vault_amount_bigger_than_zero(vault: ContractAddress, user: ContractAddress) {
    let balance_after_withdraw: u256 =
    (*
        load(
            vault, map_entry_address(selector!("amounts"),
            array![user.try_into().unwrap()].span()), 2,
        )[0]
    ).try_into().unwrap();
    assert(balance_after_withdraw >= 0, 'Mismatch balance');
}
