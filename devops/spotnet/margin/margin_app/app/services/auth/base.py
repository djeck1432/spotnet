"""
Base authentication module containing core authentication functionality.
"""

from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import InvalidTokenError
from starlette.requests import Request
import requests

from app.core.config import settings
from app.crud.admin import admin_crud
from app.models.admin import Admin
from app.schemas.admin import AdminResponse
from app.services.auth.security import verify_password


def get_expire_time(minutes: int) -> datetime:
    """
    Get the expiration time for the token.

    :param minutes: The number of minutes to add to the current time.
    :return: The expiration time.
    """
    return datetime.utcnow() + timedelta(minutes=minutes)


def create_access_token(email: str, expires_delta: timedelta | None = None):
    """
    Generates auth jwt token for a given wallet ID

    Parameters:
    - wallet_id: str, the wallet ID of the user

    Returns:
    - str: The encoded JWT as a string
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode = {"sub": email, "exp": expire}
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


async def get_current_user(token: str) -> Admin:
    """
    Retrieves the current user based on the provided JWT token.

    Parameters:
    - token (str): The JWT token used for authentication.

    Returns:
    - User: The User object corresponding to the wallet ID extracted from the token.

    Raises:
    - Exception("Invalid jwt"): if jwt is invalid
    - Exception("User not found"): if jwt correct but user doesn't exists
    - Exception("jwt expired"): if jwt expired
    """
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        email = payload.get("sub")
        if email is None:
            raise Exception("Invalid jwt")
        user = await admin_crud.get_by_email(email)
        if user is None:
            raise Exception("User not found")
        return user
    except InvalidTokenError as e:
        raise Exception("jwt expired") from e


class GoogleAuth:
    """
    Google authentication service.
    """

    google_login_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"response_type=code&client_id={settings.google_client_id}"
        f"&redirect_uri={settings.google_redirect_url}"
        f"&scope=openid%20profile%20email&access_type=offline"
    )
    user_info_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    token_url = "https://accounts.google.com/o/oauth2/token"
    params = {
        "client_id": settings.google_client_id,
        "client_secret": settings.google_client_secret,
        "redirect_uri": settings.google_redirect_url,
        "grant_type": "authorization_code",
    }

    async def get_access_token(self, code: str) -> str:
        """
        Get access token from Google OAuth.

        :param code: str - The code received from Google OAuth.

        :return: str - The access token.
        """
        self.params["code"] = code
        response = requests.post(self.token_url, data=self.params)
        response.raise_for_status()
        return response.json()["access_token"]

    async def get_user_info(self, access_token: str) -> dict:
        """
        Get user information from Google OAuth.

        :param access_token: str - The access token.

        :return: dict - The user information.
        """
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(self.user_info_url, headers=headers)
        response.raise_for_status()
        return response.json()

    async def get_user(self, code: str) -> AdminResponse:
        """
        Authenticate with Google OAuth and create an access token.

        :param code: str - The code received from Google OAuth.
        :param db: AsyncSession - The database session.

        :return: dict - details of the authenticated user.
        """
        access_token = await self.get_access_token(code)
        if not access_token:
            raise Exception("Failed to get access token")
        user_info = await self.get_user_info(access_token)
        if not user_info:
            raise Exception("Failed to get user info")

        email = user_info["email"]
        name = user_info["name"]
        user = await admin_crud.get_by_email(email)
        if not user:
            return AdminResponse.model_validate(
                await admin_crud.create_admin(email=email, name=name)
            )
        return AdminResponse(id=user.id, name=user.name, email=user.email)


google_auth = GoogleAuth()


async def get_admin_user_from_state(req: Request) -> Admin | None:
    """
    Retrieves the admin user from the request state if it exists.

    :param req: Request - The incoming request object.

    :return: Admin | None - The admin user if it exists, None otherwise.
    """
    return getattr(req.state, "admin_user", None)
