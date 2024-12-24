"""
This module contains the transaction database configuration.
"""

import uuid
from typing import TypeVar

from .base import DBConnector
from web_app.db.models import Base, Transaction, TransactionStatus

ModelType = TypeVar("ModelType", bound=Base)


class TransactionDBConnector(DBConnector):
    """
    Provides database connection and operations management for the Transaction model.
    """

    def create_transaction(
        self, position_id: uuid.UUID, transaction_hash: str, status: TransactionStatus
    ) -> Transaction:
        """
        Creates a new transaction instance
        """
        transaction = Transaction(
            position_id=position_id,
            transaction_hash=transaction_hash,
            status=status,
        )
        transaction = self.write_to_db(transaction)
        return transaction
