"""
CRUD operations for User model
"""

import asyncio
import uuid
from typing import Optional
from uuid import UUID
from sqlalchemy.sql import text
from sqlalchemy.exc import IntegrityError
from decimal import Decimal

from app.models.deposit import Deposit
from app.models.margin_position import MarginPosition
from app.models.user import User

from .base import DBConnector


class UserCRUD(DBConnector):
    """
    UserCRUD class for handling database operations for the User model.
    """

    async def test_connection(self):
        """
        Test the database connection.
        :return
        """
        async with self.session() as session:
            result = await session.execute(text("SELECT version()"))
            return f"PostgreSQL version: {result.scalar()}"
        

    async def create_user(self, wallet_id: str) -> User:
        """
        Create a new user in the database.
        :param wallet_id: str
        :return: User
        """
        new_user = User(wallet_id=wallet_id)
        return await self.write_to_db(new_user)


    async def update_user(self, user_id: UUID, **kwargs) -> Optional[User]:
        """
        Update an existing user in the database.
        :param user_id: UUID
        :return: User
        """

        async with self.session() as session:
            user = await session.get(User, user_id)
            if not user:
                return None
            
            for key, value in kwargs.items():
                setattr(user, key, value)
            await session.commit()
            await session.refresh(user)
            return user

    async def delete_user(self, user_id: UUID) -> None:
        """
        Delete a user from the database.
        :param user_id: UUID
        :return: None
        """
        await self.delete_object_by_id(User, user_id)

    async def add_deposit(
        self, user_id: UUID, amount: Decimal, 
        token: str, transaction_id: str
    ) -> Deposit:
        """
        Add a deposit to a user's account.
        :param user_id: UUID
        :param amount: Decimal
        :param token str
        :param transaction_id str
        :return: Deposit
        """

        if not await self.get_object(User, user_id):
            raise ValueError(f"User {user_id} does not exist.")
        
        new_deposit = Deposit(
            user_id=user_id, 
            amount=amount, 
            token=token, 
            transaction_id=transaction_id
        )
        return await self.write_to_db(new_deposit)

        
   
    async def add_margin_position(
        self, user_id: UUID, 
        borrowed_amount: Decimal,
        multiplier: int,
        transaction_id: str
    ) -> MarginPosition:
        """
        Add a margin position to a user's account.
        :param user_id: UUID
        :param borrowed_amount: Decimal
        :param multiplier: int
        :param transaction_id str
        :return: MarginPosition
        """

        if not await self.get_object(User, user_id):
            raise ValueError(f"User {user_id} does not exist.")
        new_margin_position = MarginPosition(
            user_id=user_id,
            borrowed_amount=borrowed_amount,
            multiplier=multiplier,
            transaction_id=transaction_id
        )
        return await self.write_to_db(new_margin_position)


user_crud = UserCRUD()
