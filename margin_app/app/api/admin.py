"""
API endpoints for admin management.
"""

from typing import Optional
from uuid import UUID
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from fastapi.responses import RedirectResponse

from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import JSONResponse
from loguru import logger
from pydantic import EmailStr
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from sqlalchemy.ext.asyncio import AsyncSession
from app.db.sessions import get_db
from app.services.auth import google_auth
from app.services.auth import save_token_to_session
from app.crud.admin import admin_crud
from app.crud.base import DBConnector
from app.models.admin import Admin
from app.schemas.admin import AdminRequest, AdminResponse, AdminResetPassword
from app.services.auth import (
    get_password_hash,
    verify_password,
    get_current_user,
    get_admin_user_from_state,
)
from app.services.emails import email_service
from app.schemas.admin import AdminRequest, AdminResponse

router = APIRouter(prefix="")


@router.post(
    "/add",
    response_model=AdminResponse,
    status_code=status.HTTP_201_CREATED,
    summary="add a new admin",
    description="Adds a new admin in the application",
)
async def add_admin(
    data: AdminRequest,
    db: DBConnector = Depends(DBConnector),
    admin_user: Admin = Depends(get_admin_user_from_state),
) -> AdminResponse:
    """
    Add a new admin with the provided admin data.

    Parameters:
        data: The admin data to add

    Returns:
        Added admin

    Raises:
        HTTPException: If there's an error in a addition the admin
    """
    new_admin = Admin(
        email=data.email,
        password=get_password_hash(data.password),
        name=data.name,
    )

    try:
        new_admin = await db.write_to_db(new_admin)

    except IntegrityError as e:
        logger.error(f"Error adding admin: email '{data.email}' is exists")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Failed to add admin: email '{data.email}' is exists",
        ) from e

    return AdminResponse(id=new_admin.id, name=new_admin.name, email=new_admin.email)


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


@router.get("/auth/google", status_code=status.HTTP_200_OK)
async def auth_google(code: str, request: Request, db: AsyncSession = Depends(get_db)):
    """
    Authenticate with Google OAuth, create an access token, and save it in the session.

    :param code: str - The code received from Google OAuth.
    :param db: AsyncSession - The database session.
    :param request: Request - The HTTP request object to access the session.

    :return: dict - A success message.
    """
    try:
        user_data = await google_auth.get_user(code=code, db=db)

        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Failed to authenticate user.",
            )

        save_token_to_session(
            email=user_data["user"].email,
            request=request,
            expires_delta=timedelta(minutes=15),
        )

        return {"message": "Authentication successful"}
    except Exception as e:
        logger.error(f"Failed to authenticate user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to authenticate user.",
        )


@router.get(
    "/all",
    response_model=list[AdminResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all admin",
    description="Get all admin",
)
async def get_all_admin(
    limit: Optional[int] = Query(25, description="Number of admins to retrieve"),
    offset: Optional[int] = Query(0, description="Number of admins to skip"),
    admin_user: Admin = Depends(get_admin_user_from_state),
) -> list[AdminResponse]:
    """
    Return all admins.

    Parameters:
    - limit: Optional[int] - max admins to be retrieved
    - offset: Optional[int] - start retrieving at

    Returns:
    - list[AdminResponse]: a list of admins

    Raises:
        HTTPException: If there's an error retrieving admins
    """
    try:
        return await admin_crud.get_all(limit, offset)
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get admins: {str(e)}",
        )


@router.get(
    "/{admin_id}",
    response_model=AdminResponse,
    status_code=status.HTTP_200_OK,
    summary="get an admin",
    description="Get an admin by ID",
)
async def get_admin(
    admin_id: UUID,
    db: DBConnector = Depends(DBConnector),
    admin_user: Admin = Depends(get_admin_user_from_state),
) -> AdminResponse:
    """
    Get admin.

    Parameters:
    - admin_id: UUID, the ID of the admin

    Returns:
    - AdminResponse: The admin object
    """
    admin = await db.get_object(Admin, admin_id)

    if not admin:
        logger.error(f"Admin with id: '{admin_id}' not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found."
        )

    return AdminResponse(id=admin.id, name=admin.name, email=admin.email)


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
    admin = await admin_crud.get_object_by_field(field="email", value=admin_email)

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
    "/reset_password/{token}",
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
