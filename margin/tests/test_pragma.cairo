use margin::margin::Margin;
use super::utils::{setup_test_suite, deploy_erc20_mock, deploy_pragma_mock};
use margin::margin::Margin::{InternalTrait};
use pragma_lib::types::{PragmaPricesResponse};
use core::starknet::storage::{StoragePointerWriteAccess};
const HYPOTHETICAL_OWNER_ADDR: felt252 =
    0x059a943ca214c10234b9a3b61c558ac20c005127d183b86a99a8f3c60a08b4ff;


#[test]
fn test_pragma() {
    let mut state = Margin::contract_state_for_testing();
    let suite = setup_test_suite(
        HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(), deploy_erc20_mock(), deploy_pragma_mock(),
    );
    state.oracle_address.write(suite.pragma.contract_address);
    let price_data: PragmaPricesResponse = state.get_data(suite.token.contract_address);
    // Assert we got valid data back
    assert(price_data.decimals == 18, 'Wrong decimals');
    assert(price_data.price > 0, 'Invalid price');
    assert(price_data.last_updated_timestamp > 0, 'Invalid timestamp');
}
