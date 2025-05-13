# Research on zkLend Liquidation

This research explored how to check and verify that zkLend closed a position due to liquidation rather than by a user through the Spotnet smart contract, particularly focusing on the deployed spotnet smart contract, the events emitted by the zkLend contract and the state changes associated with liquidation.

## Introduction

zkLend liquidation process is triggered when a borrower's Health Factor falls to 1 or lower, indicating that
the value of their collateral may not be enough to cover their debt, posing risks to the lenders and zkLend
protocol. The liquidation process incentivises external party(ies) to actively monitor zkLend's loan
portfolios to seek out borrowings that have Health Factor below 1 and to actively repay these loans to
ensure liquidity safety and health of the protocol. 

A borrower whose outstanding loan exceeds his/her borrowing capacity will be liquidated at market rate.
Instead of a static close factor, zkLend will implement a variable close factor where liquidators can only
repay the portion (or part) of loan position that has exceeded the borrowing capacity. While the liquidation
threshold for each borrower varies on his/her assets pledged as well as the borrowing asset, liquidations
happen when the underlying collateral decreases in value relative to the borrowed asset and/or if the
outstanding loan value (asset value + accrued interest) now exceeds the borrowing capacity. Examples
may include large price increases in a borrowed asset, or dramatic price decrease in the underlying
collateral.

Upon reaching liquidation threshold, any Starknet address (i.e. Liquidator) can initiate a liquidationCall()
contract to repay the debt on behalf of the borrower and receive a Liquidation Bonus (of 10% or 15%). 

Once the transaction gets through, the debtor’s position will be liquidated and the corresponding amount of collateral in USD plus the liquidation bonus will be paid back to the liquidator. Liquidators are only allowed to repay no more than the amount that will bring the borrower’s Health Factor back to 1.

## Research Methodology

To verify if a position was liquidated in zkLend, the following steps were taken:

### User Activity
1. **Check Events in Deployed Spotnet Contract**: The `Events` logs of the spotnet contract were examined on [Starkscan](https://starkscan.co/contract/0x05685d6b0b493c7c939d65c175305b893870cacad780842c79a611ad9122815f#events). Only two events were observed; `LiquidityLooped` and `OwnershipTransferred`
2. **[Check Read Functions](https://starkscan.co/contract/0x05685d6b0b493c7c939d65c175305b893870cacad780842c79a611ad9122815f#read-write-contract-sub-read)**: `is_position_open()` returned 1 (true).
3. **Check Owner/User Transaction History**: The [transaction hash](https://voyager.online/tx/0x6e916a00518bc6ed69f397188e749d48cf6b33e92057970c3c2d1a312500047#internalCalls) of the user was analyzed to check for any calls related to the liquidation process. The last 2 calls were `loop_liquidity()` and `approve()` respectively. No `close_position()` call was found.

### zkLend: Market Contract Activity
1. **Identify Relevant Events Using Starkscan**: The event logs in "Events" tab of the zkLend: Market contract were examined on Starkscan to identify any liquidation events. Identified `Liquidation` event.
2. **Analyze Event Data**: Clicked on `Liquidation` event to view its details, and found the following data including liquidator, user, debt_token, debt_raw_amount, debt_face_amount, collateral_token, collateral_amount.
3. **zkLend: Market Contract Read Functions**: Found and explored the following view functions to check if our deployed spotnet contract's position in zkLend has been closed; `is_user_undercollateralized(user, apply_borrow_factor)`, `user_has_debt(user)` and `is_collateral_enabled(user, token)` [with STRK address as token] all returned 1, indicating `true`. Thus, our contract's position is still open.

### Portfolio Check

Upon checking the portfolio of the deployed Spotnet contract, it was found that there is a balance of **1.744172753867558899 zSTRK Token**. This corresponds with `LiquidityLooped` event that showed the user (through spotnet contract) was able to achieve a collateral of **1.744172753867558898 STRK** from an initial deposit amount of **1 STRK**.

`LiquidityLooped` event also showed that **0.473917 USDC** was borrowed with the 1.744 STRK collateral. The Read function `get_user_debt_for_token(user, token)`, with USDC address as token, on zkLend Market contract returned 0.475401 USDC, 0.475529 USDC at a later time, and currently 0.476299. Checked the `balanceOf(account)` of our contract on zkLend: zSTRK Token contract, which returned 1.744438892223882014. Due to an abscence of a `Liquidation` event for our contract on zkLend, these state (small) changes must be due to market activity, interest on debts or rewards for providing liquidity/collateral.

## Result/Discussion

A python script, `zkLend_liquidation_position.py`, created for the sole purpose of getting a proof, that zkLend liquidated our contract's position, returned no liquidation results. For validation, function selectors of Deposit and Borrowing events were used, the below results were obtained; confirming the script is working.

`Deposit(user,token,face_amount)` events result by using function selector "0x9149d2123147c5f43d258257fef0b7b969db78269369ebcf5ebb9eef8592f2".

```bash
[(2445961085966391684481990189941877317677508041889657123170411312758682452319, 2009894490435840142178314390393166646092438090257831307886760648929397478285, 1000000000000000000), (2445961085966391684481990189941877317677508041889657123170411312758682452319, 2009894490435840142178314390393166646092438090257831307886760648929397478285, 494598103299498708), (2445961085966391684481990189941877317677508041889657123170411312758682452319, 2009894490435840142178314390393166646092438090257831307886760648929397478285, 249574650568060191)]
```
 
`Borrowing(user,token,raw_amount,face_amount)` events result by using corresponding function selector "0xfa3f9acdb7b24dcf6d40d77ff2f87a87bca64a830a2169aebc9173db23ff41".

```bash
[(2445961085966391684481990189941877317677508041889657123170411312758682452319, 2368576823837625528275935341135881659748932889268308403712618244410713532584, 286243), (2445961085966391684481990189941877317677508041889657123170411312758682452319, 2368576823837625528275935341135881659748932889268308403712618244410713532584, 144439)]
```

**Note:** 2445961085966391684481990189941877317677508041889657123170411312758682452319 is integer representaion of our spot contract address

From in-depth [review into zkLend market contract codebase](https://9oelm.github.io/2023-10-26-technical-intro-to-defi-lending-protocols-with-zklend-codebase-as-an-example/), two occurrences are required to confirm that zklend liquidated our position;
1. The zToken of the corresponding collateral (which is zSTRK in our case) repayed by a liquidator would be seized from our collateral balance, and sent to the liquidator. 
2. A `Liquidation` event.

The liquidators can be anyone (or their bot), and is neither a zklend or zklend related contract. Potential liquidators are monitoring the market closely and frequently, and try to call `liquidate()` earlier than their competitors with suitable amount of gas fee that might get their transaction get through earlier than others. 

From analysis of [all Starknet Liquidations](https://dune.com/caravanserai/starknet-liquidations); the below are among some of the liqudators for zkLend: 
- 0x0783e6b26807e9906b084b07cc2fcbb74ab1aec1621b3c7bd7b985c201ff32e5
- 0x04746c68f5f6d6bff7a16fdad6f543750bd6e46a7c00a9e5bb6820c86347fda0
- 0x027c8f8a9b51985b629293453d4dfcad356b959d90d00f0253a1f95edbb1ada3
- 0x013dce7b9caa42504418e76010193f69860874d7e9b3494c4621d3a1424ad35f


## Conclusion

The zkLend liquidation process is unique compared to other lending protocols, such as Aave. Unlike these protocols, zkLend does not allow liquidators to fully liquidate a position, regardless of how low the health factor is. Instead, the current design permits liquidators to partially liquidate undercollateralized positions, ensuring that the user remains undercollateralized after the liquidation.

The deployed Spotnet contract is yet to be liquidated by zkLend as evident by:
1. lack of `Liquidation` event from zkLend Events.
2. collateral balance remains the same.

And whenever it gets liquidated, the `zkLend_liquidation_position.py` script will give proof that zkLend liquidated our position.


## References

- https://github.com/zkLend/zklend-v1-core/blob/master/src/market/internal.cairo
- https://dune.com/caravanserai/starknet-liquidations
- https://medium.com/zklend/zklend-x-zkpad-ama-recap-19-04-2022-b2c925c4d816
- https://9oelm.github.io/2023-10-26-technical-intro-to-defi-lending-protocols-with-zklend-codebase-as-an-example/
- https://medium.com/@kristianaristi/liquidation-bot-on-zklend-starknet-part-1-introduction-who-is-borrowing-4d2631971a3a
