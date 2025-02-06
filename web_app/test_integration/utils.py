import uuid
from contextlib import contextmanager

from web_app.db.crud.user import UserDBConnector
from web_app.db.crud.airdrop import AirDropDBConnector
from web_app.db.crud.position import PositionDBConnector
from web_app.db.models import User


user_db = UserDBConnector()
airdrop = AirDropDBConnector()
position_db = PositionDBConnector()

@contextmanager
def with_temp_user(wallet_id: str) -> User:
    """
    Context manager to create a temporary user and clean up after the test.
    """
    user = user_db.get_user_by_wallet_id(wallet_id)
    if not user:
        user = user_db.create_user(wallet_id)
    yield user
    # Clean up
    airdrop.delete_all_users_airdrop(user.id)
    for position in position_db.get_all_positions_by_wallet_id(wallet_id, 0, 1000):
        position_db.delete_all_extra_deposits(position["id"])
    position_db.delete_all_user_positions(user.id)
    position_db.delete_user_by_wallet_id(wallet_id)                         
