export const erc20abi = [
  {
    name: 'approve',
    type: 'function',
    inputs: [
      {
        name: 'spender',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        name: 'amount',
        type: 'core::integer::u256',
      },
    ],
    outputs: [
      {
        type: 'core::bool',
      },
    ],
    state_mutability: 'external',
  },
];
