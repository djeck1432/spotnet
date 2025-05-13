# Spotnet functionality documentation

## Overview
Spotnet is a dApp designed for increasing of initial collateral deposit by utilizing lending 
protocols and AMMs for borrowing tokens, swapping them and redepositing up to x4 of starting capital(as for now).

## Spotnet Smart Contract
Smart contract consists of a constructor and three methods for public use.

### Constructor
Constructor of our contract receives three parameters(ekubo_core and zk_market are serialized to Dispatcher types for starknet::interfaces):
* `owner`: ContractAddress
* `ekubo_core`: ContractAddress
* `zk_market`: ContractAddress
Onwer address is an account address of the user who deploys it, only owner can deposit funds and close position on lending protocol.

### loop_liquidity
The `loop_liquidity` method is responsible for deposit of collateral token. For now only one position can be opened, to create the new you need to close old one.
For validating the identity of the caller is used an address of account initiated a transaction instead of a caller for testing purposes.
This method has next parameters:
* `deposit_data`: DepositData - Object of internal type which stores main deposit information.
* `pool_key`: PoolKey - Ekubo type for obtaining info about the pool and swapping tokens.
* `ekubo_limits`: EkuboSlippageLimits - Object of internal type which represents upper and lower sqrt_ratio values on Ekubo. Used to control slippage while swapping.
* `pool_price`: felt252 - Price of `deposit` token in terms of `debt` token(so for ex. 2400000000 USDC for ETH when depositing ETH).

We can trust the passed values, such as pool_price, because this function can only be called by the owner of the contract.

Its flow can be described as follows:

```
assertions

constants & dispatchers created

tokens transferred to contract from user

enabling token as collateral on lending protocol

approve & deposit initial amount

while total_deposited < initial_amount * multiplier {
    calculate borrow amount

    borrow

    swap on AMM to deposit token

    approve & deposit
}

emit event
```

### close_position
The `close_position` method is responsible for repaying debts and withdrawing all tokens from zklend. Can be called only if there is active position. For validating the 
identity of the caller is used an address of account initiated a transaction instead of a caller for testing purposes.
The method has next parameters:
* `supply_token`: ContractAddress - Address of the token used as collateral.
* `debt_token`: ContractAddress - Address of the token used as borrowing.
* `pool_key`: PoolKey - Ekubo type for obtaining info about the pool and swapping tokens.
* `ekubo_limits`: EkuboSlippageLimits - Object of internal type which represents upper and lower sqrt_ratio values on Ekubo. Used to control slippage while swapping.
* `repay_const`: u8 - Sets how much to borrow from free amount. Parameter is used for dealing with price error on zklend or for pairs where debt interest rate accumulates faster than supply interest rate.
* `supply_price`: TokenPrice - Price of `supply` token in terms of `debt` token(so for ex. 2400000000 USDC for ETH).
* `debt_price`: TokenPrice - Price of `debt` token in terms of `supply` token(for ex. 410000000000000 ETH for USDC).

Its flow can be described as follows:
```
assertions

constants & dispatchers created

while debt != 0 {
    calculate amount available for withdraw

    withdraw

    swap to debt token

    repay
}
transfer tokens to user

disable collateral token

emit event
```

### claim_reward
The `claim_reward` method claims airdrop reward accumulated by the contract that deposited into zkLend. Claim only possible if position is currently open.
This method has next parameters:
* `claim_data`: Claim - contains data about claim operation
* `proof`: Span<felt252> - proof used to validate the claim
* `airdrop_addr`: ContractAddress - address of a contract responsible for claim

Its flow can be described as follows:

```
assertions

claim tokens from airdrop contract

if treasury address is non-zero {
    calculate and transfer 50% to treasury
}

approve zkLend to spend remaining tokens

deposit remaining tokens into zkLend

enable STRK as collateral

emit event
```

The method can be called by anyone (e.g., a keeper) to claim rewards. If the treasury address is set to zero when deploying the contract, all claimed rewards will be deposited into zkLend on behalf of the user instead of being split with the treasury. This is intended behavior; sophisticated users wanting to bypass the functionality could deploy their modified contract anyway. This serves to avoid burning the STRK.


### extra_deposit

The `extra_deposit` method allows depositing additional tokens into an open zkLend position for increased stability. This method can be called by anyone, not just the position owner.

Parameters:
* `token`: ContractAddress - Address of the token to deposit 
* `amount`: TokenAmount - Amount of tokens to deposit

Its flow can be described as follows:

```
assertions (position must be open, amount must be non-zero)

transfer tokens from caller to contract

approve zkLend to spend the tokens

deposit tokens into zkLend position

emit event
```

### withdraw

The `withdraw` method withdraws tokens from zkLend position and transfers them to the owner.

Parameters
* `token`: TokenAddress - token address to withdraw from zkLend
* `amount`: TokenAmount - amount to withdraw. Pass `0` to withdraw all

It's flow can be described as follows:

```
assertions(transaction started by the owner)

withdraw tokens from zkLend and transfer to the owner

emit event
```

### is_position_open

The `is_position_open` method returns the status of the position

## Important types, events and constants
### Types
#### DepositData
The main data about the loop to perform. The `amount` * `multiplier` value is minimal amount that will be deposited after the loop.
The `borrow_const` sets how many tokens will be borrowed from available amount(borrowing power). So if there is available 1 ETH to borrow and we passed 60%, it will borrow 0.6 ETH.
This will work up to 99% of available amount, howewer, for stability against slippage and prices difference on zkLend and our source it's better to not go higher than 98%.

```
struct DepositData {
    token: ContractAddress,
    amount: TokenAmount,
    multiplier: u32,
    borrow_const: u8
}
```

#### EkuboSlippageLimits
This structure sets slippage limits for swapping on Ekubo. Maximal are `6277100250585753475930931601400621808602321654880405518632` for `upper` and `18446748437148339061` for `lower` as stated by [Ekubo docs](https://docs.ekubo.org/integration-guides/reference/error-codes#limit_mag).

### Events
```
struct LiquidityLooped {
    initial_amount: TokenAmount,
    deposited: TokenAmount,
    token_deposit: ContractAddress,
    borrowed: TokenAmount,
    token_borrowed: ContractAddress
}
```
```
struct PositionClosed {
    deposit_token: ContractAddress,
    debt_token: ContractAddress,
    withdrawn_amount: TokenAmount,
    repaid_amount: TokenAmount
}
```
```
#[derive(starknet::Event, Drop)]
struct Withdraw {
    token: ContractAddress,
    amount: TokenAmount
}
```
```
#[derive(starknet::Event, Drop)]
struct ExtraDeposit {
    token: ContractAddress,
    amount: TokenAmount,
    depositor: ContractAddress
}
```

```
#[derive(starknet::Event, Drop)]
struct RewardClaimed {
    treasury_amount: TokenAmount,
    user_amount: TokenAmount
}
```
### Constants
* ZK_SCALE_DECIMALS is used for scaling down values obtained by multiplying on zklend collateral and borrow factors.
* STRK_ADDRESS is the same across Sepolia and Mainnet.
