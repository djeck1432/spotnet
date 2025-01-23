"""
Seed data for initializing the database with predefined values.
"""

import logging
from decimal import Decimal
from typing import List

from faker import Faker
from sqlalchemy.orm import Session

from web_app.contract_tools.constants import TokenParams
from web_app.db.database import SessionLocal
from web_app.db.models import (
    AirDrop,
    Position,
    ExtraDeposit,
    Status,
    TelegramUser ,
    Transaction,
    TransactionStatus,
    User,
    Vault,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(_name_)

# Initialize Faker
fake = Faker()


def create_users(session: Session) -> List[User ]:
    """
    Create and save a list of fake users to the database.
    """
    users = []
    for _ in range(10):
        wallet_id = str(fake.unique.uuid4())
        user = User(
            wallet_id=wallet_id,
            contract_address=fake.address(),
            is_contract_deployed=fake.boolean(),
        )
        session.add(user)
    
    session.commit()
    
    # Retrieve users after commit
    users = session.query(User).all()
    
    for user in users:
        logger.info(f"Created user: {user.id} with wallet_id: {user.wallet_id}")
    
    return users


def create_positions(session: Session, users: List[User ]) -> List[Position]:
    """
    Create and save fake position records associated with given users.
    """
    positions = []
    for user in users:
        logger.info(f"Creating positions for user: {user.id}")
        for _ in range(2):
            position = Position(
                user_id=user.id,
                token_symbol=fake.random_element(
                    elements=[token.name for token in TokenParams.tokens()]
                ),
                amount=str(fake.random_number(digits=5)),
                multiplier=str(fake.random_int(min=1, max=10)),
                start_price=str(
                    fake.pydecimal(left_digits=5, right_digits=2, positive=True)
                ),
                status=fake.random_element(
                    elements=[status.value for status in Status]
                ),
                is_protection=fake.boolean(),
                liquidation_bonus=str(fake.pyfloat(min_value=0.0, max_value=1.0)),
                is_liquidated=fake.boolean(),
                datetime_liquidation=fake.date_time_this_decade(),
            )
            session.add(position)
    
    session.commit()
    
    # Retrieve positions after commit
    positions = session.query(Position).filter(Position.user_id.in_([user.id for user in users])).all()
    
    for position in positions:
        logger.info(f"Created position: {position.id} for user {position.user_id}")
    
    return positions


def create_extra_deposits(session: Session, positions: List[Position]) -> None:
    """
    Create and save fake extra deposit records associated with given positions.
    """
    extra_deposits = []
    for position in positions:
        for _ in range(3):  # Create 3 extra deposits for each position
            extra_deposit = ExtraDeposit(
                position_id=position.id,
                token_symbol=fake.random_element(
                    elements=[token.name for token in TokenParams.tokens()]
                ),
                amount=str(
                    fake.pydecimal(left_digits=5, right_digits=2, positive=True)
                ),
            )
            # Check for uniqueness before adding
            if not any(ed.position_id == extra_deposit.position_id and ed.token_symbol == extra_deposit.token_symbol for ed in extra_deposits):
                extra_deposits.append(extra_deposit)
    
    session.bulk_save_objects(extra_deposits)
    logger.info(f"Created {len(extra_deposits)} extra deposits for {len(positions)} positions.")


def create_airdrops(session: Session, users: List[User ]) -> None:
    """
    Create and save fake airdrop records for each user.
    """
    for user in users:
        for _ in range(2):
            airdrop = AirDrop(
                user_id=user.id,
                amount=str(
                    fake.pydecimal(left_digits=5, right_digits=2, positive=True)
                ),
                is_claimed=fake.boolean (),
                claimed_at=fake.date_time_this_decade() if fake.boolean() else None,
            )
            session.add(airdrop)
    
    session.commit()
    logger.info(f"Created airdrops for {len(users)} users.")


def create_telegram_users(session: Session, users: List[User  ]) -> None:
    """
    Create and save fake Telegram user records to the database.
    """
    for user in users:
        for _ in range(2):
            telegram_user = TelegramUser (
                telegram_id=str(fake.unique.uuid4()),
                username=fake.user_name(),
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                wallet_id=user.wallet_id,
                photo_url=fake.image_url(),
                is_allowed_notification=fake.boolean(),
            )
            session.add(telegram_user)
    
    session.commit()
    logger.info(f"Created Telegram users for {len(users)} users.")


def create_vaults(session: Session, users: List[User  ]) -> None:
    """
    Create and save fake vault records for each user.
    """
    for user in users:
        for _ in range(2):
            vault = Vault(
                user_id=user.id,
                symbol=fake.random_element(
                    elements=[token.name for token in TokenParams.tokens()]
                ),
                amount=str(fake.random_number(digits=5)),
            )
            session.add(vault)
    
    session.commit()
    logger.info(f"Created vaults for {len(users)} users.")


def create_transactions(session: Session, positions: List[Position]) -> None:
    """
    Create and save fake transaction records to the database.
    """
    transaction_count = 0
    for position in positions:
        transaction_statuses = [status.value for status in TransactionStatus]
        for status in transaction_statuses:
            transaction = Transaction(
                position_id=position.id,
                status=status,
                transaction_hash=str(fake.unique.uuid4()),
            )
            session.add(transaction)
            transaction_count += 1
    
    session.commit()
    logger.info(f"Created {transaction_count} transactions for {len(positions)} positions.")


def seed_database():
    """
    Main function to seed the entire database.
    """
    try:
        # Create a new session
        session = SessionLocal()
        
        try:
            # Seed data in a specific order
            users = create_users(session)
            positions = create_positions(session, users)
            create_extra_deposits(session, positions)
            create_airdrops(session, users)
            create_telegram_users(session, users)
            create_vaults(session, users)
            create_transactions(session, positions)

            logger.info("Database seeding completed successfully.")
        
        except Exception as e:
            logger.error(f"Error during database seeding: {e}", exc_info=True)
            session.rollback()
        
        finally:
            session.close()
    
    except Exception as e:
        logger.error(f"Error creating session: {e}", exc_info=True)


if _name_ == "_main_":
    seed_database()