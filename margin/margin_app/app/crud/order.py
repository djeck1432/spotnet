"""
This module contains CRUD operations for orders.
"""

import asyncio
import logging
import uuid
from decimal import Decimal
from typing import Optional

from app.crud.base import DBConnector
from app.models.user_order import UserOrder

logger = logging.getLogger(__name__)


class UserOrderCRUD(DBConnector):
    """
    CRUD operations for UserOrder model.

    Methods:
    - add_new_order: Create and store a new order in the database
    - execute_order: Process and execute an existing order
    """

    async def add_new_order(
        self, user_id: uuid.UUID, price: Decimal, token: str, position: uuid.UUID
    ) -> UserOrder:
        """
        Creates a new order in the database.

        Args:
            user_id (uuid.UUID): ID of the user placing the order
            price (float): Price of the order
            token (str): Token symbol for the order
            position (uuid.UUID): Position ID related to the order

        Returns:
            Order: The newly created order object
        """
        order = UserOrder(user_id=user_id, price=price, token=token, position=position)
        order = await self.write_to_db(order)
        return order

    async def execute_order(self, order_id: uuid.UUID) -> bool:
        """
        Processes and executes an order by its ID.

        Args:
            order_id (uuid.UUID): ID of the order to execute

        Returns:
            bool: True if the order was successfully executed, False otherwise
        """
        order = await self.get_object(order_id)
        if not order:
            return False

        # Order execution logic would go here
        return True

    async def get_by_id(self, order_id: uuid.UUID) -> UserOrder | None:
        """Get order by ID from database

        Args:
            order_id (uuid.UUID): ID of the order to get

        Returns:
            UserOrder | None: The order object if found, None otherwise
        """
        return await self.get_object(order_id)
    
    async def update_order(
        self, 
        order: UserOrder,
        user_id: Optional[uuid.UUID] = None,
        price: Optional[Decimal] = None,
        token: Optional[str] = None,
        position: Optional[uuid.UUID] = None
    ) -> UserOrder | None:
        """
        Update an existing order in the database.

        Args:
            order_id (uuid.UUID): ID of the order to update
            user_id (uuid.UUID, optional): New user ID for the order
            price (Decimal, optional): New price for the order
            token (str, optional): New token symbol for the order
            position (uuid.UUID, optional): New position ID for the order

        Returns:
            UserOrder | None: The updated order object if found and updated, None otherwise
        """

        if user_id is not None:
            order.user_id = user_id
        if price is not None:
            order.price = price
        if token is not None:
            order.token = token
        if position is not None:
            order.position = position

        updated_order = await self.write_to_db(order)
        return updated_order


order_crud = UserOrderCRUD(UserOrder)
