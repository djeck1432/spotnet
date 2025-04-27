"""
API endpoints for auth logic.
"""

from datetime import timedelta

from fastapi import APIRouter, HTTPException, status, Request
from fastapi.responses import RedirectResponse, JSONResponse
from loguru import logger
from pydantic import EmailStr

from app.core.config import settings
from app.services.auth.base import google_auth, create_access_token, get_current_user
from app.crud.admin import admin_crud
from app.schemas.admin import AdminResetPassword
from app.services.auth.security import (
    get_password_hash,
    verify_password,
)
from app.services.emails import email_service

router = APIRouter()


@router.get("/login", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
async def login_google() -> RedirectResponse:
    """
    Redirect to Google login page.

    :return: RedirectResponse - Redirect to Google login page.
    """
    return RedirectResponse(url=google_auth.google_login_url)


@router.get(
    "/logout",
    response_model=dict,
    status_code=status.HTTP_200_OK,
)
async def logout_user() -> dict:
    """
    Logout the user.

    :return: dict - A success message.
    """
    return {"message": "User logged out successfully."}


@router.get("/google", status_code=status.HTTP_200_OK)
async def auth_google(code: str, request: Request):
    """
    Authenticate with Google OAuth, create an access token, and save it in the session.

    :param code: str - The code received from Google OAuth.
    :param db: AsyncSession - The database session.
    :param request: Request - The HTTP request object to access the session.

    :return: dict - A success message.
    """
    try:
        user_data = await google_auth.get_user(code=code)

        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Failed to authenticate user.",
            )

        token = create_access_token(
            user_data.email,
            expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
        )

        return {"access_token": token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Failed to authenticate user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to authenticate user.",
        )


@router.post(
    "/change_password",
    status_code=status.HTTP_200_OK,
    summary="password change for admin",
    description="Sends an email with a reset password link",
)
async def change_password(
    admin_email: EmailStr,
):
    """
    Asynchronously handles the process of changing an admin's password
    by sending a reset password email.
    Args:
        admin_email (EmailStr): The email address of the admin whose password needs to be changed.
    Raises:
        HTTPException: If the admin with the given email is not found (404).
        HTTPException: If there is an error while sending the reset password email (500).
    Returns:
        JSONResponse: A response indicating that the reset password email was successfully sent.
    """
    admin = await admin_crud.get_by_email(admin_email)

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin with this email was not found.",
        )

    if not await email_service.reset_password_mail(to_email=admin.email):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error while sending email.",
        )

    return JSONResponse(
        content={"message": "Password reset email has been sent successfully"}
    )


@router.post(
    "/reset_password",
    status_code=status.HTTP_200_OK,
    summary="password reset for admin",
    description="change password for admin",
)
async def reset_password(data: AdminResetPassword, token: str):
    """
    Reset the password for an admin user.
    This function verifies the provided old password, updates the password
    to a new one if the verification is successful, and saves the changes
    to the database.
    Args:
        data (AdminResetPassword): An object containing the old and new passwords.
        token (str): The authentication token of the current admin user.
    Raises:
        HTTPException: If the provided old password does not match the stored password.
    Returns:
        JSONResponse: A response indicating that the password was successfully changed.
    """

    admin = await get_current_user(token=token)

    if not verify_password(data.old_password, admin.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The provided old password does not match",
        )

    admin.password = get_password_hash(data.new_password)
    await admin_crud.write_to_db(admin)
    return JSONResponse(content={"message": "Password was changed"})
