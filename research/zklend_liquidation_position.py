"""
Script to verify if a position was liquidated in zkLend.

This script checks the event logs of the zkLend contract to determine
if a specific user position was liquidated.
"""

import asyncio
import logging

from starknet_py.net.full_node_client import FullNodeClient

# Load environment variables
NODE_URL = "https://starknet-mainnet.public.blastapi.io/rpc/v0_7"
ZKLEND_CONTRACT_ADDRESS = (
    "0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05"
)
SPOTNET_DEPLOYED_CONTRACT = (
    "0x05685d6b0b493c7c939d65c175305b893870cacad780842c79a611ad9122815f"
)


# Initialize the StarkNet client
client = FullNodeClient(node_url=NODE_URL)

DEPOSIT_SELECTOR = "0xfa3f9acdb7b24dcf6d40d77ff2f87a87bca64a830a2169aebc9173db23ff41"

LIQUIDATION_SELECTOR = (
    "0x238a25785a13ab3138feb8f8f517e5a21a377cc1ad47809e9fd5e76daf01df7"
)

FROM_BLOCK = 900000
CHUNK_SIZE = 1000

logging.basicConfig(
    level=logging.INFO,
)
logger = logging.getLogger(__name__)


async def check_liquidation_proof(liquidatee_address: str) -> None:
    """
    Check if a specific liquidatee's position was liquidated in the zkLend protocol.

    This function fetches liquidation events from the zkLend market contract and checks
    if the specified liquidatee address has been liquidated. It logs the details of
    the liquidation event if found.

    Args:
        liquidatee_address (str): The address of the liquidatee whose liquidation
        status is to be checked.

    Returns:
        None: This function does not return a value; it logs the results directly.
    """

    # Fetch liquidation events
    events_chunk = await client.get_events(
        address=ZKLEND_CONTRACT_ADDRESS,
        from_block_number=FROM_BLOCK,
        to_block_number="latest",
        follow_continuation_token=True,
        chunk_size=CHUNK_SIZE,
        keys=[[LIQUIDATION_SELECTOR]],
    )

    # Access the events attribute of the EventsChunk object,
    events = events_chunk.events

    liquid_results = []

    # Process events for the specific user
    for event in events:
        # Unpack event.data object
        # sample at
        # https://starkscan.co/event/0x0204f9e81102c2e2f1af181e9a931580da5fa9a80abd21e15116a6175e00b736_10

        liquidator = event.data[0]
        liquidatee = event.data[1]
        debt_token = event.data[2]
        debt_raw_amount = event.data[3]
        debt_face_amount = event.data[4]
        collateral_token = event.data[5]
        collateral_amount = event.data[6]

        if int(liquidatee_address, base=16) == liquidatee:
            liquid_results.append(
                (liquidator, liquidatee, debt_face_amount, collateral_amount)
            )
            # Log the details of the liquidation
            logger.info("Beginning of an Event!!")
            logger.info(
                f"Liquidation Event: {liquidator} liquidated {liquidatee}'s position."
            )
            logger.info(f"Debt Token: {debt_token}, Amount: {debt_raw_amount}")
            logger.info(
                f"Collateral Token: {collateral_token}, Amount: {collateral_amount}"
            )

    # Print all liquidation results after processing all events
    if liquid_results:
        logger.info(f"Liquidation Results: {liquid_results}")
    else:
        logger.info(f"No liquidation events found for user {liquidatee_address}.")


if __name__ == "__main__":
    asyncio.run(check_liquidation_proof(SPOTNET_DEPLOYED_CONTRACT))
