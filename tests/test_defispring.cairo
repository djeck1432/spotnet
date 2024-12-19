use openzeppelin_token::erc20::interface::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};
use snforge_std::{
    declare, DeclareResultTrait, replace_bytecode, store, cheat_account_contract_address, CheatSpan
};
use spotnet::constants::STRK_ADDRESS;
use spotnet::interfaces::{IDepositDispatcher, IDepositDispatcherTrait};
use spotnet::types::Claim;
use starknet::ContractAddress;
use super::constants::HYPOTHETICAL_OWNER_ADDR;

const ADDRESS_ELIGIBLE_FOR_ZKLEND_REWARDS: felt252 =
    0x020281104e6cb5884dabcdf3be376cf4ff7b680741a7bb20e5e07c26cd4870af;

#[test]
#[fork("MAINNET_FIXED_BLOCK")]
fn test_claim_as_keeper() {
    let strk = ERC20ABIDispatcher { contract_address: STRK_ADDRESS.try_into().unwrap() };
    let defispring_claim_contract: ContractAddress =
        0x2d55d6f311413945595788818d4e89e151360a2c2c6b5270d5d0ed16475505f
        .try_into()
        .unwrap();

    let address_eligible_for_zklend_rewards: ContractAddress = ADDRESS_ELIGIBLE_FOR_ZKLEND_REWARDS
        .try_into()
        .unwrap();
    let contract = declare("Deposit").unwrap().contract_class();
    replace_bytecode(address_eligible_for_zklend_rewards, *contract.class_hash).unwrap();

    let strk_balance_at_start = strk
        .balance_of(address_eligible_for_zklend_rewards.try_into().unwrap());

    // write the treasury address so we can check funds were sent
    let hypothetical_treasury_address = 0x98765;
    let storage_entry_for_treasury_address = array![hypothetical_treasury_address].span();
    store(
        address_eligible_for_zklend_rewards,
        selector!("treasury"),
        storage_entry_for_treasury_address
    );
    let ZKLEND_MARKET = 0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05;
    let storage_entry_for_zk_market = array![ZKLEND_MARKET].span();
    store(address_eligible_for_zklend_rewards, selector!("zk_market"), storage_entry_for_zk_market);

    let deposit_contract = IDepositDispatcher {
        contract_address: address_eligible_for_zklend_rewards
    };
    let proof = array![
        0x43a677604d8a532f023b8a1480e39f0a4f95460a88eb978bf86cf2e6af4a505,
        0x69faedf42e0dccc605c8f5b773c58154bd51f1d807ce51d6a254b58379df414,
        0x75afcd7c6775bd043279c5adf5cfc8519175ddb640d9bab3a80d6216fc434f2,
        0x718d5326a3a934d067b4930ff2ffbc6dba50eb189ddecc50d559c74e30ce375,
        0x60842dbbced8d585d720c3efe1f99fb32da09f6334f3ef679dbfbc9b47fcf2b,
        0x7d22c5040360327dc761eb46959c15f888b68af777829d758150612ec13949c,
        0x406de13ffdac0138c360921e9e51bb7fdabe9770c750157e40e04909589c0e7,
        0x4f138575a80804622f8b92152ffaf19e634c63934348d13b92dd1eb91bfa3c,
        0x1ca16be8f87a5dc8cbdd781a8e2e37b047ccdc0552ea048f8cbc28b6e0e9621,
        0x6e5d1a64f19a0a541716f701413ae2bace2151b83da7b231ebb347c2be8272b,
        0xf1e537b49ce8629386bfab3e390bb5dee770e0c8a176115b82607f9d9fa441,
        0x517330339d2b79fff83a99bfa17d974267ff1a49fa517bda0ec6105130d15e1,
        0x17230a4e2cb1bc3fb6a83c165e9f8f719c5198065e02d4aac7c55b75ac92fc0,
        0x787a4ca028ae34239a07b4d023f4ef785c9aa934da05a0fd2ec1310dc1a6d83
    ];
    let claim: Claim = Claim {
        id: 11051, claimee: address_eligible_for_zklend_rewards, amount: 0x2a52c411698a729
    };
    // eligible for 0x2a52c411698a729 = 190607217296713513 fri (fri is lowest denominator of strk
    // token)
    // treasury should get 95303608648356757 which is 50 %
    deposit_contract.claim_reward(claim, proof.span(), defispring_claim_contract);

    let fri_in_treasury = strk.balance_of(hypothetical_treasury_address.try_into().unwrap());
    assert(fri_in_treasury == 95303608648356757, 'incorrect amount in treasury');
    let strk_left_in_contract = strk
        .balance_of(address_eligible_for_zklend_rewards.try_into().unwrap());
    assert!(
        strk_left_in_contract == strk_balance_at_start, "strk left in contract after airdrop claim"
    );
}

#[test]
#[fork("MAINNET_FIXED_BLOCK")]
fn test_claim_and_withdraw() {
    test_claim_as_keeper();
    let address_eligible_for_zklend_rewards: ContractAddress = ADDRESS_ELIGIBLE_FOR_ZKLEND_REWARDS
        .try_into()
        .unwrap();
    let deposit_contract = IDepositDispatcher {
        contract_address: address_eligible_for_zklend_rewards
    };
    let strk = ERC20ABIDispatcher { contract_address: STRK_ADDRESS.try_into().unwrap() };
    let hypothetical_owner_address: ContractAddress = HYPOTHETICAL_OWNER_ADDR.try_into().unwrap();
    let storage_entry_for_hypothetical_owner = array![HYPOTHETICAL_OWNER_ADDR].span();
    store(
        address_eligible_for_zklend_rewards,
        selector!("Ownable_owner"),
        storage_entry_for_hypothetical_owner
    );

    cheat_account_contract_address(
        address_eligible_for_zklend_rewards, hypothetical_owner_address, CheatSpan::TargetCalls(1)
    );
    deposit_contract.withdraw(STRK_ADDRESS.try_into().unwrap(), 0); //passing 0 to withdraw all

    assert(strk.balance_of(hypothetical_owner_address) != 0, 'no strk sent on to user');
}
