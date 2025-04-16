"""Module for generating seed data"""

import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "..", ".."))

from asyncio import run
from datetime import datetime
from hashlib import sha256

from app.db.sessions import AsyncSessionLocal
from app.models import (Admin, Deposit, Liquidation, MarginPosition, Pool,
                        Transaction, User, UserOrder, UserPool)
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


class SeedDataGenerator:
    """
    SeedDataGenerator is responsible for generating seed data for the database.
    """

    def __init__(self, amount: int = 5):
        """
        Initialize the generator with the specified amount of data to generate.

        :param amount: Number of records to generate for each model.
        """
        self.amount = amount
        self.faker = Faker()

    def generate_hex(self) -> str:
        """
        Generate a hex-encoded hash prefixed with '0x'.

        :return: A hex-encoded string.
        """
        random_string = self.faker.uuid4()
        return "0x" + sha256(random_string.encode()).hexdigest()

    async def generate_users(self, session: AsyncSession):
        """
        Generate user records and add them to the session.

        :param session: The database session.
        """
        users = []
        for _ in range(self.amount):
            user = User(
                wallet_id=self.generate_hex(),
            )
            users.append(user)
        session.add_all(users)
        await session.commit()

    async def generate_deposits(self, session: AsyncSession):
        """
        Generate deposit records for each user and add them to the session.

        :param session: The database session.
        """
        deposits = []
        users = await session.execute(select(User))
        users = users.scalars().all()
        for user in users:
            for _ in range(self.amount):
                deposit = Deposit(
                    user_id=user.id,
                    token=self.faker.currency_code(),
                    amount=self.faker.pydecimal(
                        left_digits=5, right_digits=2, positive=True
                    ),
                    transaction_id=self.generate_hex(),
                )
                deposits.append(deposit)
        session.add_all(deposits)
        await session.commit()

    async def generate_margin_positions(self, session: AsyncSession):
        """
        Generate margin position records for each user and add them to the session.

        :param session: The database session.
        """
        positions = []
        users = await session.execute(select(User))
        users = users.scalars().all()
        for user in users:
            for _ in range(self.amount):
                position = MarginPosition(
                    user_id=user.id,
                    multiplier=self.faker.random_int(min=1, max=20),
                    borrowed_amount=self.faker.pydecimal(
                        left_digits=5, right_digits=2, positive=True
                    ),
                    status=self.faker.random_element(elements=["Open", "Closed"]),
                    transaction_id=self.generate_hex(),
                )
                positions.append(position)
        session.add_all(positions)
        await session.commit()

    async def generate_pools(self, session: AsyncSession):
        """
        Generate pool records and add them to the session.

        :param session: The database session.
        """
        pools = []
        for _ in range(self.amount):
            pool = Pool(
                token=self.faker.currency_code(),
                risk_status=self.faker.random_element(
                    elements=["low", "medium", "high"]
                ),
            )
            pools.append(pool)
        session.add_all(pools)
        await session.commit()

    async def generate_user_pools(self, session: AsyncSession):
        """
        Generate user pool records for each user and pool, and add them to the session.

        :param session: The database session.
        """
        user_pools = []
        users = await session.execute(select(User))
        users = users.scalars().all()
        pools = await session.execute(select(Pool))
        pools = pools.scalars().all()
        for user in users:
            for pool in pools:
                user_pool = UserPool(
                    user_id=user.id,
                    pool_id=pool.id,
                    amount=self.faker.pydecimal(
                        left_digits=5, right_digits=2, positive=True
                    ),
                )
                user_pools.append(user_pool)
        session.add_all(user_pools)
        await session.commit()

    async def generate_admins(self, session: AsyncSession):
        """
        Generate admin records and add them to the session.

        :param session: The database session.
        """
        admins = []
        for _ in range(self.amount):
            admin = Admin(
                name=self.faker.name(),
                email=self.faker.email(),
                password=self.faker.password(),
            )
            admins.append(admin)
        session.add_all(admins)
        await session.commit()

    async def generate_liquidations(self, session: AsyncSession):
        """
        Generate liquidation records for each margin position and add them to the session.

        :param session: The database session.
        """
        liquidations = []
        positions = await session.execute(select(MarginPosition))
        positions = positions.scalars().all()
        for position in positions:
            liquidation = Liquidation(
                margin_position_id=position.id,
                bonus_amount=self.faker.pydecimal(
                    left_digits=5, right_digits=2, positive=True
                ),
                bonus_token=self.faker.currency_code(),
            )
            liquidations.append(liquidation)
            position.liquidated_at = datetime.now()
            await session.merge(position)
        session.add_all(liquidations)
        await session.commit()

    async def generate_user_orders(self, session: AsyncSession):
        """
        Generate order records for each user and add them to the session.

        :param session: The database session.
        """
        user_orders = []
        users = await session.execute(select(User))
        users = users.scalars().all()
        for user in users:
            position = await session.scalar(
                select(MarginPosition).where(MarginPosition.user_id == user.id)
            )
            user_order = UserOrder(
                user_id=user.id,
                price=self.faker.pydecimal(
                    left_digits=5, right_digits=2, positive=True
                ),
                token=self.faker.currency_code(),
                position=position.id,
            )
            user_orders.append(user_order)
        session.add_all(user_orders)
        await session.commit()

    async def generate_transactions(self, session: AsyncSession):
        """
        Generate transaction records for each position and add them to the session.

        :param session: The database session.
        """

        transactions = []
        positions = await session.execute(select(MarginPosition))
        positions = positions.scalars().all()
        transaction_types = ["deposit", "withdrawal", "interest", "liquidation"]

        for position in positions:
            for _ in range(self.faker.random_int(min=2, max=4)):
                transaction = Transaction(
                    transaction_id=self.generate_hex(),
                    event_name=self.faker.random_element(transaction_types),
                    user_id=position.user_id,
                )
                transactions.append(transaction)

        session.add_all(transactions)
        await session.commit()

    async def generate_all(self):
        """
        Generate all types of records and add them to the session.
        """
        async with AsyncSessionLocal() as session:
            await self.generate_users(session)
            print("Successfully generated users")
            await self.generate_deposits(session)
            print("Successfully generated deposits")
            await self.generate_margin_positions(session)
            print("Successfully generated margin positions")
            await self.generate_pools(session)
            print("Successfully generated pools")
            await self.generate_user_pools(session)
            print("Successfully generated user pools")
            await self.generate_admins(session)
            print("Successfully generated admins")
            await self.generate_liquidations(session)
            print("Successfully generated liquidations")
            await self.generate_user_orders(session)
            print("Successfully generated orders")
            await self.generate_transactions(session)
            print("Successfully generated transactions")


if __name__ == "__main__":
    generator = SeedDataGenerator()
    run(generator.generate_all())
