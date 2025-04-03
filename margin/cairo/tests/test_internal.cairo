use margin::margin::Margin;
use super::utils::{setup_test_suite, deploy_erc20_mock, deploy_pragma_mock, ERC20_MOCK_CONTRACT};
use margin::margin::Margin::{InternalTrait};
use core::starknet::{storage::{StoragePointerWriteAccess}, contract_address_const};
use margin::interface::{IMockPragmaOracleDispatcherTrait};

const HYPOTHETICAL_OWNER_ADDR: felt252 =
    0x059a943ca214c10234b9a3b61c558ac20c005127d183b86a99a8f3c60a08b4ff;


#[test]
fn test_get_borrow_amount() {
    let mut state = Margin::contract_state_for_testing();
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(),
        deploy_erc20_mock(ERC20_MOCK_CONTRACT(), "ERC20Mock"),
        deploy_pragma_mock(),
    );

    let eth_contract_address = contract_address_const::<'ETH'>();
    let strk_contract_address = contract_address_const::<'STRK'>();

    // deploy eth and strk tokens
    let _ = deploy_erc20_mock(eth_contract_address, "ETH");
    let _ = deploy_erc20_mock(strk_contract_address, "STRK");

    // setup price for testing
    suite.pragma_mock.set_price_token(eth_contract_address, 2000_00000000);
    suite.pragma_mock.set_price_token(strk_contract_address, 5_0000000);

    state.oracle_address.write(suite.pragma.contract_address);
    let amount = state.get_borrow_amount(eth_contract_address, strk_contract_address, 1, 50000);

    assert(amount == 16000, 'Wrong borrow amount');
}

