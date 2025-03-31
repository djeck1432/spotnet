use alexandria_math::fast_power::fast_power;
use core::panic_with_felt252;
use ekubo::types::keys::{PoolKey};
use openzeppelin::access::ownable::interface::{
    OwnableTwoStepABIDispatcherTrait, OwnableTwoStepABIDispatcher
};
use openzeppelin::token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};

use snforge_std::cheatcodes::execution_info::account_contract_address::{
    start_cheat_account_contract_address, stop_cheat_account_contract_address
};
use snforge_std::cheatcodes::execution_info::block_timestamp::{
    start_cheat_block_timestamp, stop_cheat_block_timestamp
};
use snforge_std::cheatcodes::execution_info::caller_address::{
    start_cheat_caller_address, stop_cheat_caller_address
};
use spotnet::constants::{ZK_SCALE_DECIMALS, STRK_ADDRESS};
use spotnet::interfaces::{
    IDepositDispatcher, IDepositSafeDispatcher, IDepositSafeDispatcherTrait, IDepositDispatcherTrait
};
use spotnet::types::{DepositData, VaultRepayData};

use starknet::{ContractAddress, get_block_timestamp};
use super::constants::{contracts, tokens, HYPOTHETICAL_OWNER_ADDR, pool_key};

use super::interfaces::{IMarketTestingDispatcher, IMarketTestingDispatcherTrait};
use super::utils::{
    deploy_deposit_contract, 
    get_asset_price_pragma, 
    get_slippage_limits, 
    setup_test_suite,
    assert_vault_amount_bigger_than_zero
};

fn get_deposit_dispatcher(user: ContractAddress) -> IDepositDispatcher {
    IDepositDispatcher { contract_address: deploy_deposit_contract(user) }
}

fn get_safe_deposit_dispatcher(user: ContractAddress) -> IDepositSafeDispatcher {
    IDepositSafeDispatcher { contract_address: deploy_deposit_contract(user) }
}

#[test]
#[fork("MAINNET")]
fn test_loop_eth_valid() {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };
    let pool_price = get_asset_price_pragma('ETH/USD').into();
    let token_disp = ERC20ABIDispatcher { contract_address: eth_addr };
    let deposit_disp = get_deposit_dispatcher(user);
    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 685000000000000);
    stop_cheat_caller_address(eth_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData {
                token: eth_addr, amount: 685000000000000, multiplier: 40, borrow_portion_percent: 98
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);
}

#[test]
#[feature("safe_dispatcher")]
#[fork("MAINNET")]
fn test_loop_eth_fuzz(amount: u64) {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };

    let pool_price = get_asset_price_pragma('ETH/USD').into();
    let token_disp = ERC20ABIDispatcher { contract_address: eth_addr };
    let deposit_disp = get_safe_deposit_dispatcher(user);

    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, amount.into());
    stop_cheat_caller_address(eth_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    if let Result::Err(panic_data) = deposit_disp
        .loop_liquidity(
            DepositData {
                token: eth_addr, amount: amount.into(), multiplier: 40, borrow_portion_percent: 95
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        ) {
        let message = *panic_data.at(0);
        assert(
            message == 'Parameters cannot be zero'
                || message == 'Loop amount is too small'
                || message == 'Approved amount insufficient'
                || message == 'Insufficient balance',
            message
        ); // Acceptable panics which can be triggered by fuzzers' values
    };
    stop_cheat_account_contract_address(deposit_disp.contract_address);
}

#[test]
#[fork("MAINNET")]
fn test_loop_usdc_valid() {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };

    let token_disp = ERC20ABIDispatcher { contract_address: usdc_addr };
    let decimals_sum_power: u128 = fast_power(
        10,
        (ERC20ABIDispatcher { contract_address: eth_addr }.decimals() + token_disp.decimals())
            .into()
    );
    let pool_price = (1
        * ZK_SCALE_DECIMALS
        * decimals_sum_power.into()
        / get_asset_price_pragma('ETH/USD').into())
        / ZK_SCALE_DECIMALS;

    let deposit_disp = get_deposit_dispatcher(user);
    start_cheat_caller_address(usdc_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 60000000);
    stop_cheat_caller_address(usdc_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData {
                token: usdc_addr, amount: 60000000, multiplier: 40, borrow_portion_percent: 90
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price.try_into().unwrap()
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);
}

#[test]
#[should_panic(expected: 'Caller is not the owner')]
#[fork("MAINNET")]
fn test_loop_unauthorized() {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };

    let decimals_sum_power: u128 = fast_power(
        10,
        (ERC20ABIDispatcher { contract_address: eth_addr }.decimals()
            + ERC20ABIDispatcher { contract_address: usdc_addr }.decimals())
            .into()
    );
    let pool_price = ((1
        * ZK_SCALE_DECIMALS
        * decimals_sum_power.into()
        / get_asset_price_pragma('ETH/USD').into())
        / ZK_SCALE_DECIMALS)
        .try_into()
        .unwrap();

    let disp = get_deposit_dispatcher(user);

    disp
        .loop_liquidity(
            DepositData {
                token: usdc_addr, amount: 10000000, multiplier: 39, borrow_portion_percent: 90
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        );
}

#[test]
#[should_panic(expected: 'Open position already exists')]
#[fork("MAINNET")]
fn test_loop_position_exists() {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };

    let token_disp = ERC20ABIDispatcher { contract_address: usdc_addr };
    let decimals_sum_power: u128 = fast_power(
        10,
        (ERC20ABIDispatcher { contract_address: eth_addr }.decimals() + token_disp.decimals())
            .into()
    );
    let pool_price = ((1
        * ZK_SCALE_DECIMALS
        * decimals_sum_power.into()
        / get_asset_price_pragma('ETH/USD').into())
        / ZK_SCALE_DECIMALS)
        .try_into()
        .unwrap();
    let deposit_disp = get_deposit_dispatcher(user);
    start_cheat_caller_address(usdc_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 60000000);
    stop_cheat_caller_address(usdc_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData {
                token: usdc_addr, amount: 60000000, multiplier: 40, borrow_portion_percent: 90
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        );
    deposit_disp
        .loop_liquidity(
            DepositData {
                token: usdc_addr, amount: 60000000, multiplier: 19, borrow_portion_percent: 98
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);
}

#[test]
#[feature("safe_dispatcher")]
#[fork("MAINNET")]
fn test_loop_position_exists_fuzz(amount: u64) {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };

    let pool_price = get_asset_price_pragma('ETH/USD').into();
    let token_disp = ERC20ABIDispatcher { contract_address: eth_addr };
    let deposit_disp = get_safe_deposit_dispatcher(user);

    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, amount.into());
    stop_cheat_caller_address(eth_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);

    if let Result::Err(_) = deposit_disp
        .loop_liquidity(
            DepositData {
                token: eth_addr, amount: amount.into(), multiplier: 28, borrow_portion_percent: 98
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        ) {
        return;
    };
    match deposit_disp
        .loop_liquidity(
            DepositData {
                token: eth_addr, amount: amount.into(), multiplier: 40, borrow_portion_percent: 98
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        ) {
        Result::Ok(_) => panic_with_felt252('Not panicked with position open'),
        Result::Err(panic_data) => assert(
            *panic_data.at(0) == 'Open position already exists', *panic_data.at(0)
        )
    };
    stop_cheat_account_contract_address(deposit_disp.contract_address);
}

#[test]
#[fork("MAINNET")]
fn test_close_position_usdc_valid_time_passed() {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };
    let quote_token_price = get_asset_price_pragma('ETH/USD').into();

    let token_disp = ERC20ABIDispatcher { contract_address: usdc_addr };
    let initial_balance = token_disp.balanceOf(user);

    let decimals_sum_power: u128 = fast_power(
        10,
        (ERC20ABIDispatcher { contract_address: eth_addr }.decimals() + token_disp.decimals())
            .into()
    );
    let pool_price = ((1
        * ZK_SCALE_DECIMALS
        * decimals_sum_power.into()
        / get_asset_price_pragma('ETH/USD').into())
        / ZK_SCALE_DECIMALS)
        .try_into()
        .unwrap();
    let deposit_disp = get_deposit_dispatcher(user);

    start_cheat_caller_address(usdc_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 1000000000);
    stop_cheat_caller_address(usdc_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData {
                token: usdc_addr, amount: 1000000000, multiplier: 35, borrow_portion_percent: 90
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    start_cheat_block_timestamp(
        contracts::ZKLEND_MARKET.try_into().unwrap(), get_block_timestamp() + 40000000
    );

    deposit_disp
        .close_position(
            usdc_addr,
            eth_addr,
            pool_key,
            get_slippage_limits(pool_key),
            95,
            pool_price,
            quote_token_price,
            [].span()
        );

    stop_cheat_block_timestamp(contracts::ZKLEND_MARKET.try_into().unwrap());
    stop_cheat_account_contract_address(deposit_disp.contract_address);

    assert(token_disp.balanceOf(user) > initial_balance, 'Balance is in wrong state');
}

#[test]
#[fork("MAINNET")]
fn test_close_position_amounts_cleared() {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };
    let quote_token_price = get_asset_price_pragma('ETH/USD').into();

    let token_disp = ERC20ABIDispatcher { contract_address: usdc_addr };
    let decimals_sum_power: u128 = fast_power(
        10,
        (ERC20ABIDispatcher { contract_address: eth_addr }.decimals() + token_disp.decimals())
            .into()
    );
    let pool_price = (1 * ZK_SCALE_DECIMALS * decimals_sum_power.into() / quote_token_price.into())
        / ZK_SCALE_DECIMALS;
    let deposit_disp = get_deposit_dispatcher(user);

    start_cheat_caller_address(usdc_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 1000000000);
    stop_cheat_caller_address(usdc_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData {
                token: usdc_addr, amount: 1000000000, multiplier: 40, borrow_portion_percent: 90
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price.try_into().unwrap()
        );
    deposit_disp
        .close_position(
            usdc_addr,
            eth_addr,
            pool_key,
            get_slippage_limits(pool_key),
            95,
            pool_price.try_into().unwrap(),
            quote_token_price,
            [].span()
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);
    let zk_market = IMarketTestingDispatcher {
        contract_address: contracts::ZKLEND_MARKET.try_into().unwrap()
    };

    assert(
        zk_market.get_user_debt_for_token(deposit_disp.contract_address, eth_addr) == 0,
        'Debt remains after repay'
    );
    assert(
        ERC20ABIDispatcher {
            contract_address: zk_market.get_reserve_data(usdc_addr).z_token_address
        }
            .balanceOf(deposit_disp.contract_address) == 0,
        'Not all withdrawn'
    );
}

#[test]
#[fork("MAINNET")]
fn test_close_position_partial_debt_utilization() {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };
    let pool_price = get_asset_price_pragma('ETH/USD').into();

    let token_disp = ERC20ABIDispatcher { contract_address: eth_addr };
    let decimals_sum_power: u128 = fast_power(
        10,
        (ERC20ABIDispatcher { contract_address: usdc_addr }.decimals() + token_disp.decimals())
            .into()
    );
    let quote_token_price = ((1 * ZK_SCALE_DECIMALS * decimals_sum_power.into() / pool_price.into())
        / ZK_SCALE_DECIMALS)
        .try_into()
        .unwrap();

    let deposit_disp = get_deposit_dispatcher(user);

    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 1000000000000000);
    stop_cheat_caller_address(eth_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData {
                token: eth_addr,
                amount: 1000000000000000,
                multiplier: 40,
                borrow_portion_percent: 98
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        );
    deposit_disp
        .close_position(
            eth_addr,
            usdc_addr,
            pool_key,
            get_slippage_limits(pool_key),
            95,
            pool_price,
            quote_token_price,
            [].span()
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);
    let zk_market = IMarketTestingDispatcher {
        contract_address: contracts::ZKLEND_MARKET.try_into().unwrap()
    };

    assert(
        zk_market.get_user_debt_for_token(deposit_disp.contract_address, eth_addr) == 0,
        'Debt remains after repay'
    );
    assert(
        ERC20ABIDispatcher {
            contract_address: zk_market.get_reserve_data(usdc_addr).z_token_address
        }
            .balanceOf(deposit_disp.contract_address) == 0,
        'Not all withdrawn'
    );
}

#[test]
#[fork("MAINNET")]
fn test_extra_deposit_valid() {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };
    let quote_token_price = get_asset_price_pragma('ETH/USD').into();

    let token_disp = ERC20ABIDispatcher { contract_address: usdc_addr };
    let decimals_sum_power: u128 = fast_power(
        10,
        (ERC20ABIDispatcher { contract_address: eth_addr }.decimals() + token_disp.decimals())
            .into()
    );
    let pool_price = ((1 * ZK_SCALE_DECIMALS * decimals_sum_power.into() / quote_token_price)
        / ZK_SCALE_DECIMALS)
        .try_into()
        .unwrap();
    let deposit_disp = get_deposit_dispatcher(user);

    start_cheat_caller_address(usdc_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 1000000000);
    stop_cheat_caller_address(usdc_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData {
                token: usdc_addr, amount: 1000000000, multiplier: 40, borrow_portion_percent: 95
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);
    let zk_market = IMarketTestingDispatcher {
        contract_address: contracts::ZKLEND_MARKET.try_into().unwrap()
    };

    start_cheat_caller_address(eth_addr, user);
    ERC20ABIDispatcher { contract_address: eth_addr }
        .approve(deposit_disp.contract_address, 10000000000000);
    stop_cheat_caller_address(eth_addr);

    start_cheat_caller_address(deposit_disp.contract_address, user);
    deposit_disp.extra_deposit(eth_addr, 10000000000000);
    stop_cheat_caller_address(deposit_disp.contract_address);

    assert(
        ERC20ABIDispatcher {
            contract_address: zk_market.get_reserve_data(eth_addr).z_token_address
        }
            .balanceOf(deposit_disp.contract_address) != 0,
        'Tokens not deposited'
    );
}

#[test]
#[fork("MAINNET")]
fn test_extra_deposit_supply_token_close_position_fuzz(extra_amount: u32) {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };
    let quote_token_price = get_asset_price_pragma('ETH/USD').into();

    let token_disp = ERC20ABIDispatcher { contract_address: usdc_addr };
    let decimals_sum_power: u128 = fast_power(
        10,
        (ERC20ABIDispatcher { contract_address: eth_addr }.decimals() + token_disp.decimals())
            .into()
    );
    let pool_price = ((1 * ZK_SCALE_DECIMALS * decimals_sum_power.into() / quote_token_price)
        / ZK_SCALE_DECIMALS)
        .try_into()
        .unwrap();
    let deposit_disp = get_deposit_dispatcher(user);

    start_cheat_caller_address(usdc_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 1000000000);
    stop_cheat_caller_address(usdc_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData {
                token: usdc_addr, amount: 1000000000, multiplier: 40, borrow_portion_percent: 94
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);
    let zk_market = IMarketTestingDispatcher {
        contract_address: contracts::ZKLEND_MARKET.try_into().unwrap()
    };

    start_cheat_caller_address(usdc_addr, user);
    ERC20ABIDispatcher { contract_address: usdc_addr }
        .approve(deposit_disp.contract_address, extra_amount.into());
    stop_cheat_caller_address(usdc_addr);
    let safe_deposit_disp = IDepositSafeDispatcher {
        contract_address: deposit_disp.contract_address
    };
    start_cheat_caller_address(deposit_disp.contract_address, user);
    if let Result::Err(panic_data) = safe_deposit_disp
        .extra_deposit(usdc_addr, extra_amount.into()) {
        assert(*panic_data.at(0) == 'Deposit amount is zero', *panic_data.at(0));
        return;
    }
    stop_cheat_caller_address(deposit_disp.contract_address);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .close_position(
            usdc_addr,
            eth_addr,
            pool_key,
            get_slippage_limits(pool_key),
            95,
            pool_price,
            quote_token_price.try_into().unwrap(),
            [].span()
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);

    assert(
        ERC20ABIDispatcher {
            contract_address: zk_market.get_reserve_data(usdc_addr).z_token_address
        }
            .balanceOf(deposit_disp.contract_address) == 0,
        'Not all withdrawn'
    );
}

#[test]
#[fork("MAINNET")]
fn test_withdraw_valid_fuzz(amount: u32) {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };
    let quote_token_price = get_asset_price_pragma('ETH/USD').into();

    let token_disp = ERC20ABIDispatcher { contract_address: usdc_addr };
    let decimals_sum_power: u128 = fast_power(
        10,
        (ERC20ABIDispatcher { contract_address: eth_addr }.decimals() + token_disp.decimals())
            .into()
    );
    let pool_price = ((1
        * ZK_SCALE_DECIMALS
        * decimals_sum_power.into()
        / get_asset_price_pragma('ETH/USD').into())
        / ZK_SCALE_DECIMALS)
        .try_into()
        .unwrap();
    let deposit_disp = get_deposit_dispatcher(user);

    start_cheat_caller_address(usdc_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 1000000000);
    stop_cheat_caller_address(usdc_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData {
                token: usdc_addr, amount: 1000000000, multiplier: 40, borrow_portion_percent: 90
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);
    let zk_market = IMarketTestingDispatcher {
        contract_address: contracts::ZKLEND_MARKET.try_into().unwrap()
    };
    let eth_disp = ERC20ABIDispatcher { contract_address: eth_addr };
    start_cheat_caller_address(eth_addr, user);
    eth_disp.approve(deposit_disp.contract_address, 10000000000000);
    stop_cheat_caller_address(eth_addr);

    start_cheat_caller_address(deposit_disp.contract_address, user);
    deposit_disp.extra_deposit(eth_addr, 10000000000000);
    stop_cheat_caller_address(deposit_disp.contract_address);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .close_position(
            usdc_addr,
            eth_addr,
            pool_key,
            get_slippage_limits(pool_key),
            95,
            pool_price,
            quote_token_price,
            [].span()
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);

    let z_eth_disp = ERC20ABIDispatcher {
        contract_address: zk_market.get_reserve_data(eth_addr).z_token_address
    };

    let contract_pre_balance = z_eth_disp.balanceOf(deposit_disp.contract_address);
    let to_withdraw_expected = if amount == 0 {
        contract_pre_balance
    } else {
        amount.into()
    };

    let user_pre_balance = eth_disp.balanceOf(user);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp.withdraw(eth_addr, amount.into());
    stop_cheat_account_contract_address(deposit_disp.contract_address);

    if amount == 0 {
        assert(z_eth_disp.balanceOf(deposit_disp.contract_address) == 0, 'Wrong contract balance');
    } else {
        // Z Token balance may increase, making equation not strict
        assert(
            contract_pre_balance
                - z_eth_disp.balanceOf(deposit_disp.contract_address) <= amount.into(),
            'Wrong contract balance'
        );
    };
    assert(
        user_pre_balance + to_withdraw_expected == eth_disp.balanceOf(user),
        'Wrong amount withdrawn'
    );
}

#[test]
#[should_panic(expected: 'Open position not exists')]
#[fork("MAINNET")]
fn test_extra_deposit_position_not_exists() {
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let token_disp = ERC20ABIDispatcher { contract_address: eth_addr };
    let deposit_disp = get_deposit_dispatcher(user);

    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 100000000000);
    deposit_disp.extra_deposit(eth_addr, 100000000000);
    stop_cheat_caller_address(eth_addr);
}

#[test]
#[should_panic(expected: 'Deposit amount is zero')]
#[fork("MAINNET")]
fn test_extra_deposit_position_zero_amount() {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };

    let pool_price = get_asset_price_pragma('ETH/USD').into();
    let token_disp = ERC20ABIDispatcher { contract_address: eth_addr };
    let deposit_disp = get_deposit_dispatcher(user);

    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 685000000000000);
    stop_cheat_caller_address(eth_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData {
                token: eth_addr, amount: 685000000000000, multiplier: 20, borrow_portion_percent: 98
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);

    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    deposit_disp.extra_deposit(eth_addr, 0);
    stop_cheat_caller_address(eth_addr);
}

#[test]
#[fork("MAINNET")]
fn test_withdraw_position_open() {
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();

    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };

    let pool_price = get_asset_price_pragma('ETH/USD').into();
    let token_disp = ERC20ABIDispatcher { contract_address: eth_addr };
    let deposit_disp = get_deposit_dispatcher(user);

    start_cheat_caller_address(eth_addr.try_into().unwrap(), user);
    token_disp.approve(deposit_disp.contract_address, 685000000000000);
    stop_cheat_caller_address(eth_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData {
                token: eth_addr, amount: 685000000000000, multiplier: 20, borrow_portion_percent: 98
            },
            pool_key,
            get_slippage_limits(pool_key),
            pool_price
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp.withdraw(eth_addr, 100000000000000);
    stop_cheat_account_contract_address(deposit_disp.contract_address);
}

#[test]
fn test_transfer_ownership_valid() {
    let user = 0x123.try_into().unwrap();
    let new_owner = 0x456.try_into().unwrap();
    let deposit_disp = get_deposit_dispatcher(user);
    let ownable_disp = OwnableTwoStepABIDispatcher {
        contract_address: deposit_disp.contract_address
    };
    start_cheat_caller_address(deposit_disp.contract_address, user);
    ownable_disp.transfer_ownership(new_owner);
    stop_cheat_caller_address(deposit_disp.contract_address);

    start_cheat_caller_address(deposit_disp.contract_address, new_owner);
    ownable_disp.accept_ownership();
    stop_cheat_caller_address(deposit_disp.contract_address);

    assert(ownable_disp.owner() == new_owner, 'Owner did not change');
}

#[test]
#[should_panic(expected: 'Caller is not the pending owner')]
fn test_transfer_renounced_ownership() {
    let user = 0x123.try_into().unwrap();
    let new_owner = 0x456.try_into().unwrap();
    let deposit_disp = get_deposit_dispatcher(user);
    let ownable_disp = OwnableTwoStepABIDispatcher {
        contract_address: deposit_disp.contract_address
    };
    start_cheat_caller_address(deposit_disp.contract_address, user);
    ownable_disp.transfer_ownership(new_owner);
    stop_cheat_caller_address(deposit_disp.contract_address);

    assert(ownable_disp.pending_owner() == new_owner, 'Pending owner is incorrect');

    start_cheat_caller_address(deposit_disp.contract_address, user);
    ownable_disp.transfer_ownership(user);
    stop_cheat_caller_address(deposit_disp.contract_address);

    start_cheat_caller_address(deposit_disp.contract_address, new_owner);
    ownable_disp.accept_ownership();
    stop_cheat_caller_address(deposit_disp.contract_address);

    assert(ownable_disp.owner() == new_owner, 'Owner did not change');
}

#[test]
#[fork("MAINNET")]
fn test_repay_vaults_in_close_position(){
    let usdc_addr: ContractAddress = tokens::USDC.try_into().unwrap();
    let eth_addr: ContractAddress = tokens::ETH.try_into().unwrap();
    let strk_addr: ContractAddress = STRK_ADDRESS.try_into().unwrap();
    let user: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let amount = 1000000;

    let repay_vaults = array![
        // First will be skip in repay_vaults, because usdc_addr == supply_token
        VaultRepayData{vault: setup_test_suite(user, usdc_addr).vault.contract_address, amount},
        VaultRepayData{vault: setup_test_suite(user, eth_addr).vault.contract_address, amount},
        VaultRepayData{vault: setup_test_suite(user, strk_addr).vault.contract_address, amount}
    ];
    
    let pool_key = PoolKey {
        token0: eth_addr,
        token1: usdc_addr,
        fee: pool_key::FEE,
        tick_spacing: pool_key::TICK_SPACING,
        extension: pool_key::EXTENSION.try_into().unwrap()
    };
    let quote_token_price = get_asset_price_pragma('ETH/USD').into();

    let usdc_token_disp = ERC20ABIDispatcher { contract_address: usdc_addr };
    let eth_token_disp = ERC20ABIDispatcher { contract_address: eth_addr };
    let strk_token_disp = ERC20ABIDispatcher { contract_address: strk_addr };

    let decimals_sum_power: u128 = fast_power(
        10,
        (eth_token_disp.decimals() + usdc_token_disp.decimals())
            .into()
    );
    let pool_price = ((1
        * ZK_SCALE_DECIMALS
        * decimals_sum_power.into()
        / get_asset_price_pragma('ETH/USD').into())
        / ZK_SCALE_DECIMALS)
        .try_into()
        .unwrap();

    let deposit_disp = get_deposit_dispatcher(user);
    let borrow_portion_percent = 90;
    let multiplier = 35;
    let limits = get_slippage_limits(pool_key);

    start_cheat_caller_address(usdc_addr, user);
    usdc_token_disp.approve(deposit_disp.contract_address, amount);
    stop_cheat_caller_address(usdc_addr);

    start_cheat_caller_address(strk_addr, user);
    strk_token_disp.approve(deposit_disp.contract_address, amount);
    stop_cheat_caller_address(strk_addr);

    start_cheat_caller_address(eth_addr, user);
    eth_token_disp.approve(deposit_disp.contract_address, amount);
    stop_cheat_caller_address(eth_addr);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    deposit_disp
        .loop_liquidity(
            DepositData {
                token: usdc_addr, amount, 
                multiplier, borrow_portion_percent
            },
            pool_key, limits, pool_price
        );
    stop_cheat_account_contract_address(deposit_disp.contract_address);

    start_cheat_caller_address(deposit_disp.contract_address, user);
    deposit_disp.extra_deposit(strk_addr, amount);
    deposit_disp.extra_deposit(eth_addr, amount);
    stop_cheat_caller_address(deposit_disp.contract_address);

    start_cheat_account_contract_address(deposit_disp.contract_address, user);
    start_cheat_block_timestamp(
        contracts::ZKLEND_MARKET.try_into().unwrap(), get_block_timestamp() + 40000000
    );
    deposit_disp
        .close_position(
            usdc_addr, eth_addr, pool_key, limits,
            borrow_portion_percent, pool_price, quote_token_price,
            repay_vaults.span()
        );
    stop_cheat_block_timestamp(contracts::ZKLEND_MARKET.try_into().unwrap());
    stop_cheat_account_contract_address(deposit_disp.contract_address);

    for vault in repay_vaults {
        assert_vault_amount_bigger_than_zero(vault.vault, user);
    }
}
