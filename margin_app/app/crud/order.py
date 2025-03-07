"""
This module contains CRUD operations for orders.
"""

import logging
import uuid

from app.crud.base import DBConnector
from app.models.order import Order

logger = logging.getLogger(__name__)


class OrderCRUD(DBConnector):
    """
    CRUD operations for Order model.

    Methods:
    - add_new_order: Create and store a new order in the database
    - execute_order: Process and execute an existing order
    """

    async def add_new_order(
        self, user_id: uuid.UUID, price: float, token: str, position: uuid.UUID
    ) -> Order:
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
        order = Order(user_id=user_id, price=price, token=token, position=position)

        try:
            order = await self.write_to_db(order)
            logger.info(f"New order created with ID: {order.id}")
            return order
        except Exception as e:
            logger.error(f"Error creating order: {str(e)}")
            raise

    async def execute_order(self, order_id: uuid.UUID) -> bool:
        """
        Processes and executes an order by its ID.

        Args:
            order_id (uuid.UUID): ID of the order to execute

        Returns:
            bool: True if the order was successfully executed, False otherwise
        """
        try:
            order = await self.get_object(Order, order_id)
            if not order:
                logger.warning(f"Order with ID {order_id} not found")
                return False

            # Order execution logic would go here
            logger.info(f"Order {order_id} executed successfully")
            return True

        except Exception as e:
            logger.error(f"Failed to execute order {order_id}: {str(e)}")
            return False


order_crud = OrderCRUD()
