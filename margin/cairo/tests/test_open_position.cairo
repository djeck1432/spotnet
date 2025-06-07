use margin::interface::{IMarginDispatcher, IMarginDispatcherTrait};
use openzeppelin::token::erc20::interface::{IERC20DispatcherTrait, IERC20Dispatcher};
use super::utils::{setup_test_suite, setup_user};
use starknet::{ContractAddress, get_caller_address};
use snforge_std::{start_cheat_caller_address, stop_cheat_caller_address, test_address};
use margin::types::{PositionParameters, EkuboSlippageLimits};
use ekubo::types::keys::PoolKey;

use super::constants::{
    HYPOTHETICAL_OWNER_ADDR, DEPOSIT_MOCK_USER, DEPOSIT_MOCK_USER_2, tokens::{STRK, ETH, USDC},
    contracts::PRAGMA_MAINNET,
};

// TODO: Add more test cases
#[test]
#[fork("MAINNET")]
fn test_open_position_valid() {
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        USDC.try_into().unwrap(),
        PRAGMA_MAINNET.try_into().unwrap(),
        true,
    );
    let deposit_amount: u256 = 10000000;
    // let user: ContractAddress =
    // 0x06Cb0F3004Be46bcfc3d3030E08ebDDD64f13da663AD715FB4Aabe5423c7b862.try_into().unwrap();
    let user: ContractAddress = 0x00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b
        .try_into()
        .unwrap();

    start_cheat_caller_address(
        suite.margin.contract_address, HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
    );
    suite.margin.set_risk_factor(suite.token.contract_address, 800000000000000000000000000);

    stop_cheat_caller_address(suite.margin.contract_address);

    start_cheat_caller_address(suite.token.contract_address, user);
    suite.token.approve(suite.margin.contract_address, deposit_amount);
    stop_cheat_caller_address(suite.token.contract_address);
    let initial_token: ContractAddress = ETH.try_into().unwrap();
    start_cheat_caller_address(suite.margin.contract_address, user);
    suite.margin.deposit(suite.token.contract_address, deposit_amount);

    stop_cheat_caller_address(suite.margin.contract_address);

    start_cheat_caller_address(initial_token, user);
    IERC20Dispatcher { contract_address: initial_token }.transfer(test_address(), 10000000000000);
    stop_cheat_caller_address(initial_token);

    IERC20Dispatcher { contract_address: initial_token }
        .approve(suite.margin.contract_address, 10000000000000);

    let position_parameters = PositionParameters {
        initial_token,
        debt_token: suite.token.contract_address,
        amount: 10000000000000,
        multiplier: 50,
    };

    // let pool_key = PoolKey {
    //     token0: initial_token,
    //     token1: suite.token.contract_address,
    //     extension: 0.try_into().unwrap(),
    //     fee: 0x20c49ba5e353f80000000000000000,
    //     tick_spacing: 1000,
    // };

    let pool_key_usdc = PoolKey {
        token0: initial_token,
        token1: suite.token.contract_address,
        extension: 0.try_into().unwrap(),
        fee: 0x20c49ba5e353f80000000000000000,
        tick_spacing: 1000,
    };

    suite
        .margin
        .open_margin_position(
            position_parameters,
            pool_key_usdc,
            EkuboSlippageLimits {
                lower: 18446748437148339061,
                upper: 6277100250585753475930931601400621808602321654880405518632,
            },
        );

    println!("{}", suite.token.balance_of(user));
}

