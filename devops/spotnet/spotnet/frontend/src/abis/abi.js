export const abi = [
  {
    type: 'impl',
    name: 'Deposit',
    interface_name: 'spotnet::interfaces::IDeposit',
  },
  {
    type: 'struct',
    name: 'core::integer::u256',
    members: [
      {
        name: 'low',
        type: 'core::integer::u128',
      },
      {
        name: 'high',
        type: 'core::integer::u128',
      },
    ],
  },
  {
    type: 'struct',
    name: 'spotnet::types::DepositData',
    members: [
      {
        name: 'token',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        name: 'amount',
        type: 'core::integer::u256',
      },
      {
        name: 'multiplier',
        type: 'core::integer::u8',
      },
      {
        name: 'borrow_portion_percent',
        type: 'core::integer::u8',
      },
    ],
  },
  {
    type: 'struct',
    name: 'ekubo::types::keys::PoolKey',
    members: [
      {
        name: 'token0',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        name: 'token1',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        name: 'fee',
        type: 'core::integer::u128',
      },
      {
        name: 'tick_spacing',
        type: 'core::integer::u128',
      },
      {
        name: 'extension',
        type: 'core::starknet::contract_address::ContractAddress',
      },
    ],
  },
  {
    type: 'struct',
    name: 'spotnet::types::EkuboSlippageLimits',
    members: [
      {
        name: 'lower',
        type: 'core::integer::u256',
      },
      {
        name: 'upper',
        type: 'core::integer::u256',
      },
    ],
  },
  {
    type: 'struct',
    name: 'spotnet::types::Claim',
    members: [
      {
        name: 'id',
        type: 'core::integer::u64',
      },
      {
        name: 'claimee',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        name: 'amount',
        type: 'core::integer::u128',
      },
    ],
  },
  {
    type: 'struct',
    name: 'core::array::Span::<core::felt252>',
    members: [
      {
        name: 'snapshot',
        type: '@core::array::Array::<core::felt252>',
      },
    ],
  },
  {
    type: 'interface',
    name: 'spotnet::interfaces::IDeposit',
    items: [
      {
        type: 'function',
        name: 'loop_liquidity',
        inputs: [
          {
            name: 'deposit_data',
            type: 'spotnet::types::DepositData',
          },
          {
            name: 'pool_key',
            type: 'ekubo::types::keys::PoolKey',
          },
          {
            name: 'ekubo_limits',
            type: 'spotnet::types::EkuboSlippageLimits',
          },
          {
            name: 'pool_price',
            type: 'core::integer::u128',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'close_position',
        inputs: [
          {
            name: 'supply_token',
            type: 'core::starknet::contract_address::ContractAddress',
          },
          {
            name: 'debt_token',
            type: 'core::starknet::contract_address::ContractAddress',
          },
          {
            name: 'pool_key',
            type: 'ekubo::types::keys::PoolKey',
          },
          {
            name: 'ekubo_limits',
            type: 'spotnet::types::EkuboSlippageLimits',
          },
          {
            name: 'borrow_portion_percent',
            type: 'core::integer::u8',
          },
          {
            name: 'supply_price',
            type: 'core::integer::u128',
          },
          {
            name: 'debt_price',
            type: 'core::integer::u128',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'claim_reward',
        inputs: [
          {
            name: 'claim_data',
            type: 'spotnet::types::Claim',
          },
          {
            name: 'proof',
            type: 'core::array::Span::<core::felt252>',
          },
          {
            name: 'airdrop_addr',
            type: 'core::starknet::contract_address::ContractAddress',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'extra_deposit',
        inputs: [
          {
            name: 'token',
            type: 'core::starknet::contract_address::ContractAddress',
          },
          {
            name: 'amount',
            type: 'core::integer::u256',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'withdraw',
        inputs: [
          {
            name: 'token',
            type: 'core::starknet::contract_address::ContractAddress',
          },
          {
            name: 'amount',
            type: 'core::integer::u256',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
    ],
  },
  {
    type: 'impl',
    name: 'Locker',
    interface_name: 'ekubo::interfaces::core::ILocker',
  },
  {
    type: 'interface',
    name: 'ekubo::interfaces::core::ILocker',
    items: [
      {
        type: 'function',
        name: 'locked',
        inputs: [
          {
            name: 'id',
            type: 'core::integer::u32',
          },
          {
            name: 'data',
            type: 'core::array::Span::<core::felt252>',
          },
        ],
        outputs: [
          {
            type: 'core::array::Span::<core::felt252>',
          },
        ],
        state_mutability: 'external',
      },
    ],
  },
  {
    type: 'impl',
    name: 'UpgradeableImpl',
    interface_name: 'openzeppelin_upgrades::interface::IUpgradeable',
  },
  {
    type: 'interface',
    name: 'openzeppelin_upgrades::interface::IUpgradeable',
    items: [
      {
        type: 'function',
        name: 'upgrade',
        inputs: [
          {
            name: 'new_class_hash',
            type: 'core::starknet::class_hash::ClassHash',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
    ],
  },
  {
    type: 'impl',
    name: 'OwnableTwoStepMixinImpl',
    interface_name: 'openzeppelin_access::ownable::interface::OwnableTwoStepABI',
  },
  {
    type: 'interface',
    name: 'openzeppelin_access::ownable::interface::OwnableTwoStepABI',
    items: [
      {
        type: 'function',
        name: 'owner',
        inputs: [],
        outputs: [
          {
            type: 'core::starknet::contract_address::ContractAddress',
          },
        ],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'pending_owner',
        inputs: [],
        outputs: [
          {
            type: 'core::starknet::contract_address::ContractAddress',
          },
        ],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'accept_ownership',
        inputs: [],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'transfer_ownership',
        inputs: [
          {
            name: 'new_owner',
            type: 'core::starknet::contract_address::ContractAddress',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'renounce_ownership',
        inputs: [],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'pendingOwner',
        inputs: [],
        outputs: [
          {
            type: 'core::starknet::contract_address::ContractAddress',
          },
        ],
        state_mutability: 'view',
      },
      {
        type: 'function',
        name: 'acceptOwnership',
        inputs: [],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'transferOwnership',
        inputs: [
          {
            name: 'newOwner',
            type: 'core::starknet::contract_address::ContractAddress',
          },
        ],
        outputs: [],
        state_mutability: 'external',
      },
      {
        type: 'function',
        name: 'renounceOwnership',
        inputs: [],
        outputs: [],
        state_mutability: 'external',
      },
    ],
  },
  {
    type: 'struct',
    name: 'ekubo::interfaces::core::ICoreDispatcher',
    members: [
      {
        name: 'contract_address',
        type: 'core::starknet::contract_address::ContractAddress',
      },
    ],
  },
  {
    type: 'struct',
    name: 'spotnet::interfaces::IMarketDispatcher',
    members: [
      {
        name: 'contract_address',
        type: 'core::starknet::contract_address::ContractAddress',
      },
    ],
  },
  {
    type: 'constructor',
    name: 'constructor',
    inputs: [
      {
        name: 'owner',
        type: 'core::starknet::contract_address::ContractAddress',
      },
      {
        name: 'ekubo_core',
        type: 'ekubo::interfaces::core::ICoreDispatcher',
      },
      {
        name: 'zk_market',
        type: 'spotnet::interfaces::IMarketDispatcher',
      },
      {
        name: 'treasury',
        type: 'core::starknet::contract_address::ContractAddress',
      },
    ],
  },
  {
    type: 'event',
    name: 'spotnet::deposit::Deposit::LiquidityLooped',
    kind: 'struct',
    members: [
      {
        name: 'initial_amount',
        type: 'core::integer::u256',
        kind: 'data',
      },
      {
        name: 'deposited',
        type: 'core::integer::u256',
        kind: 'data',
      },
      {
        name: 'token_deposit',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'data',
      },
      {
        name: 'borrowed',
        type: 'core::integer::u256',
        kind: 'data',
      },
      {
        name: 'token_borrowed',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'data',
      },
    ],
  },
  {
    type: 'event',
    name: 'spotnet::deposit::Deposit::PositionClosed',
    kind: 'struct',
    members: [
      {
        name: 'deposit_token',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'data',
      },
      {
        name: 'debt_token',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'data',
      },
      {
        name: 'withdrawn_amount',
        type: 'core::integer::u256',
        kind: 'data',
      },
      {
        name: 'repaid_amount',
        type: 'core::integer::u256',
        kind: 'data',
      },
    ],
  },
  {
    type: 'event',
    name: 'spotnet::deposit::Deposit::Withdraw',
    kind: 'struct',
    members: [
      {
        name: 'token',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'data',
      },
      {
        name: 'amount',
        type: 'core::integer::u256',
        kind: 'data',
      },
    ],
  },
  {
    type: 'event',
    name: 'spotnet::deposit::Deposit::ExtraDeposit',
    kind: 'struct',
    members: [
      {
        name: 'token',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'data',
      },
      {
        name: 'amount',
        type: 'core::integer::u256',
        kind: 'data',
      },
      {
        name: 'depositor',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'data',
      },
    ],
  },
  {
    type: 'event',
    name: 'spotnet::deposit::Deposit::RewardClaimed',
    kind: 'struct',
    members: [
      {
        name: 'treasury_amount',
        type: 'core::integer::u256',
        kind: 'data',
      },
      {
        name: 'user_amount',
        type: 'core::integer::u256',
        kind: 'data',
      },
    ],
  },
  {
    type: 'event',
    name: 'openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred',
    kind: 'struct',
    members: [
      {
        name: 'previous_owner',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'key',
      },
      {
        name: 'new_owner',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'key',
      },
    ],
  },
  {
    type: 'event',
    name: 'openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted',
    kind: 'struct',
    members: [
      {
        name: 'previous_owner',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'key',
      },
      {
        name: 'new_owner',
        type: 'core::starknet::contract_address::ContractAddress',
        kind: 'key',
      },
    ],
  },
  {
    type: 'event',
    name: 'openzeppelin_access::ownable::ownable::OwnableComponent::Event',
    kind: 'enum',
    variants: [
      {
        name: 'OwnershipTransferred',
        type: 'openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred',
        kind: 'nested',
      },
      {
        name: 'OwnershipTransferStarted',
        type: 'openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted',
        kind: 'nested',
      },
    ],
  },
  {
    type: 'event',
    name: 'openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event',
    kind: 'enum',
    variants: [],
  },
  {
    type: 'event',
    name: 'openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded',
    kind: 'struct',
    members: [
      {
        name: 'class_hash',
        type: 'core::starknet::class_hash::ClassHash',
        kind: 'data',
      },
    ],
  },
  {
    type: 'event',
    name: 'openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event',
    kind: 'enum',
    variants: [
      {
        name: 'Upgraded',
        type: 'openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded',
        kind: 'nested',
      },
    ],
  },
  {
    type: 'event',
    name: 'spotnet::deposit::Deposit::Event',
    kind: 'enum',
    variants: [
      {
        name: 'LiquidityLooped',
        type: 'spotnet::deposit::Deposit::LiquidityLooped',
        kind: 'nested',
      },
      {
        name: 'PositionClosed',
        type: 'spotnet::deposit::Deposit::PositionClosed',
        kind: 'nested',
      },
      {
        name: 'Withdraw',
        type: 'spotnet::deposit::Deposit::Withdraw',
        kind: 'nested',
      },
      {
        name: 'ExtraDeposit',
        type: 'spotnet::deposit::Deposit::ExtraDeposit',
        kind: 'nested',
      },
      {
        name: 'RewardClaimed',
        type: 'spotnet::deposit::Deposit::RewardClaimed',
        kind: 'nested',
      },
      {
        name: 'OwnableEvent',
        type: 'openzeppelin_access::ownable::ownable::OwnableComponent::Event',
        kind: 'flat',
      },
      {
        name: 'ReentrancyGuardEvent',
        type: 'openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::Event',
        kind: 'flat',
      },
      {
        name: 'UpgradeableEvent',
        type: 'openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event',
        kind: 'flat',
      },
    ],
  },
];
