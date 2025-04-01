"""
This module provides CRUD operations for deposits.
"""

import logging
import uuid
from decimal import Decimal
from typing import Any, Dict, Optional

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

from app.crud.base import DBConnector
from app.models.deposit import Deposit

logger = logging.getLogger(__name__)


class DepositCRUD(DBConnector):
    """
    Provides CRUD operations for managing deposits in the database.

    This class extends the DBConnector base class to add specific operations
    for creating and updating deposit records.

    Methods:
    - create_deposit: Creates a new deposit record.
    - update_deposit: Updates an existing deposit entry.
    """

    async def create_deposit(
        self, user_id: uuid.UUID, token: str, amount: Decimal, transaction_id: str
    ) -> Deposit:
        """
        Creates a new deposit entry in the database.

        Args:
            user_id (uuid.UUID): The unique identifier of the user making the deposit.
            token (str): The token/currency being deposited.
            amount (Decimal): The amount being deposited.
            transaction_id (str): Unique identifier for the transaction.

        Returns:
            Deposit: The created deposit object with db ID assigned.

        Raises:
            Exception: If the database operation fails.
        """

        try:
            deposit_data = {
                "user_id": user_id,
                "token": token,
                "amount": amount,
                "transaction_id": transaction_id,
            }
            new_deposit = Deposit(**deposit_data)
            return await self.write_to_db(new_deposit)
        except SQLAlchemyError as e:
            logger.error(f"Failed to create deposit: {e}")
            raise Exception("Could not create deposit") from e

    async def update_deposit(
        self, deposit_id: uuid.UUID, update_data: Dict[str, Any]
    ) -> Optional[Deposit]:
        """
        Updates the deposit amount for a given deposit ID.
        Args:
            deposit_id (uuid.UUID): The unique identifier of the deposit to update.
            update_data (Dict[str, Any]): Dictionary containing the fields to update.
            May include: token, amount, transaction_id
        Returns:
            Optional[Deposit]: The updated deposit object if found, None otherwise.
        Raises:
            SQLAlchemyError: If the database operation fails
        """
        try:
            async with self.session() as db:
                deposit = await db.get(Deposit, deposit_id)
                if not deposit:
                    logger.warning(f"Deposit with ID {deposit_id} not found")
                    return None

                # Update the deposit object with the new data
                # Only allow updating specific fields
                allowed_fields = {"token", "amount", "transaction_id"}
                for key, value in update_data.items():
                    if key in allowed_fields and hasattr(deposit, key):
                        setattr(deposit, key, value)

                await db.commit()
                await db.refresh(deposit)  # Refresh to reflect changes in DB
                return deposit
        except SQLAlchemyError as e:
            logger.error(f"Error updating deposit with ID {deposit_id}: {e}")
            raise


deposit_crud = DepositCRUD(Deposit)