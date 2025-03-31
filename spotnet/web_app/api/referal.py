"""
FastAPI app for generating referral links based on wallet IDs.

Endpoint:
- GET /api/create_referal_link: Creates a referral link with a random code for a user.

Dependencies:
- SQLAlchemy: For user lookup in the database.
- FastAPI: For handling API requests.
- random and string: For generating referral codes.

Errors:
- 404: If the user with the provided wallet ID does not exist.
"""

import random
import string

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Query
from sqlalchemy.orm import Session

from web_app.db.database import Base, get_database
from web_app.db.crud import UserDBConnector
from pydantic import BaseModel

app = FastAPI()
router = APIRouter(
    prefix="/api",
    tags=["referral"],
    responses={404: {"description": "Not found"}},
)


class ReferralResponse(BaseModel):
    """ 
    Response model
    """
    
    wallet_id: str
    referral_code: str


def generate_random_string(length=16):
    """
    Generate a random string of letters and digits with the given length.

    Args:
        length (int): Length of the string (default is 16).

    Returns:
        str: Randomly generated string.
    """

    return "".join(random.choices(string.ascii_letters + string.digits, k=length))


@router.get("/create_referal_link")
async def create_referal_link(
    wallet_id: str = Query(..., description="Wallet ID of the user"),
    db: Session = Depends(get_database),
):
    """
    Create a referral link for a user.

    Args:
        wallet_id (str): The wallet ID of the user

    Returns:
        dict: Wallet ID and the generated referral code

    Raises:
        HTTPException: If the user is not found in the database
    """
    
    if not wallet_id:
        raise HTTPException(status_code=400, detail="Wallet ID cannot be empty")

    user = UserDBConnector.get_user_by_wallet_id(db, wallet_id)
    if not user:
        raise HTTPException(
            status_code=404, detail="User with the provided wallet_id does not exist"
        )

    referral_code = generate_random_string()
    return ReferralResponse(wallet_id=wallet_id, referral_code=referral_code)


app.include_router(router)
