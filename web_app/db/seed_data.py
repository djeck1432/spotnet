"""
Seed data for initializing the database with predefined values.
"""
import logging
from decimal import Decimal
from faker import Faker
from web_app.db.models import Status, User, Position, AirDrop, TelegramUser, Vault
from web_app.db.database import SessionLocal
from web_app.contract_tools.constants import TokenParams

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Faker
fake = Faker()


def create_users(session: SessionLocal) -> list[User]:
    """
    Create and save a list of fake users to the database.
    Args:
        session (Session): SQLAlchemy session object.
    Returns:
        list[User]: A list of User objects added to the database.
    """
    users = []
    for _ in range(10):
        user = User(
            wallet_id=fake.unique.uuid4(),
            contract_address=fake.address(),
            is_contract_deployed=fake.boolean(),
        )
        users.append(user)
    session.add_all(users)
    session.commit()
    return users


def create_positions(session: SessionLocal, users: list[User]) -> None:
    """
    Create and save fake position records associated with given users.
    Args:
        session (Session): SQLAlchemy session object.
        users (list): List of User objects to associate with positions.
    """
    positions = []
    for user in users:
        for _ in range(2):
            position = Position(
                user_id=user.id,
                token_symbol=fake.random_choices(
                    elements=[token.name for token in TokenParams.tokens()]
                ),
                amount=fake.random_number(digits=5),
                multiplier=fake.random_int(min=1, max=10),
                start_price=Decimal(
                    fake.pydecimal(left_digits=5, right_digits=2, positive=True)
                ),
                status=fake.random_element(
                    elements=[status.value for status in Status]
                ),
                is_protection=fake.boolean(),
                liquidation_bonus=fake.pyfloat(min_value=0.0, max_value=1.0),
                is_liquidated=fake.boolean(),
                datetime_liquidation=fake.date_time_this_decade(),
            )
            positions.append(position)
    if positions:
        session.bulk_save_objects(positions)
        session.commit()
        logger.info(f"Created {len(positions)} positions for {len(users)} users.")
    else:
        logger.info("No positions created.")


def create_airdrops(session: SessionLocal, users: list[User]) -> None:
    """
    Create and save fake airdrop records for each user.
    Args:
        session (Session): SQLAlchemy session object.
        users (list): List of User objects to associate with airdrops.
    """
    airdrops = []
    for user in users:
        for _ in range(2):
            airdrop = AirDrop(
                user_id=user.id,
                amount=Decimal(
                    fake.pydecimal(left_digits=5, right_digits=2, positive=True)
                ),
                is_claimed=fake.boolean(),
                claimed_at=fake.date_time_this_decade() if fake.boolean() else None,
            )
            airdrops.append(airdrop)
    if airdrops:
        session.bulk_save_objects(airdrops)
        session.commit()


def create_telegram_users(session: SessionLocal, users: list[User]) -> None:
    """
    Create and save fake Telegram user records to the database.
    Args:
        session (Session): SQLAlchemy session object.
    """
    telegram_users = []
    for user in users:
        for _ in range(2):
            telegram_user = TelegramUser(
                telegram_id=fake.unique.uuid4(),
                username=fake.user_name(),
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                wallet_id=user.wallet_id,
                photo_url=fake.image_url(),
                is_allowed_notification=fake.boolean(),
            )
            telegram_users.append(telegram_user)
    session.bulk_save_objects(telegram_users)
    session.commit()
    logger.info(f"Created {len(telegram_users)} Telegram users.")


def create_vaults(session: SessionLocal, users: list[User]) -> None:
    """
    Create and save fake vault records for each user.
    Args:
        session (Session): SQLAlchemy session object.
        users (list): List of User objects to associate with vaults.
    """
    vaults = []
    for user in users:
        for _ in range(2): 
            vault = Vault(
                user_id=user.id,
                symbol=fake.random_choices(
                    elements=[token.name for token in TokenParams.tokens()]
                ),
                amount=str(fake.random_number(digits=5)),  # Amount stored as string in model
            )
            vaults.append(vault)
    
    if vaults:
        session.bulk_save_objects(vaults)
        session.commit()
        logger.info(f"Created {len(vaults)} vaults for {len(users)} users.")
    else:
        logger.info("No vaults created.")


if __name__ == "__main__":
    # Start a new session for seeding data
    with SessionLocal() as session:
        # Populate the database
        users = create_users(session)
        create_positions(session, users)
        create_airdrops(session, users)
        create_telegram_users(session, users)
        create_vaults(session, users)

    logger.info("Database populated with fake data.")
