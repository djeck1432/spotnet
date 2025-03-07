const DEPOSIT_MOCK_USER: felt252 =
    0x0038925b0bcf4dce081042ca26a96300d9e181b910328db54a6c89e5451503f5;
const HYPOTHETICAL_OWNER_ADDR: felt252 =
    0x059a943ca214c10234b9a3b61c558ac20c005127d183b86a99a8f3c60a08b4ff;

#[test]
fn test_pragma() {
    let suite = setup_test_suite(HYPOTHETICAL_OWNER_ADDR.try_into().unwrap(), deploy_erc20_mock());

    let margin_contract = suite.margin;

    // No error
    let _ = margin_contract.get_asset_data();
}
