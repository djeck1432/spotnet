"""
API endpoints for admin management.
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status
from loguru import logger
from sqlalchemy.exc import IntegrityError

from app.api.common import GetAllMediator
from app.crud.admin import admin_crud
from app.models.admin import Admin
from app.schemas.admin import (
    AdminRequest,
    AdminResponse,
    AdminResetPassword,
    AdminGetAllResponse,
)
from app.services.auth.base import get_admin_user_from_state
from app.services.auth.security import get_password_hash, verify_password
from app.services.emails import email_service
from fastapi.responses import JSONResponse
from pydantic import EmailStr

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
        new_admin = await admin_crud.write_to_db(new_admin)

    except IntegrityError as e:
        logger.error(f"Error adding admin: email '{data.email}' is exists")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Failed to add admin: email '{data.email}' is exists",
        ) from e

    return AdminResponse(id=new_admin.id, name=new_admin.name, email=new_admin.email)


@router.get(
    "/all",
    response_model=AdminGetAllResponse,
    status_code=status.HTTP_200_OK,
    summary="Get all admin",
)
async def get_all_admin(
    limit: Optional[int] = Query(25, gt=0),
    offset: Optional[int] = Query(0, ge=0),
) -> AdminGetAllResponse:
    """
    Get all admins.
    :param limit: Limit of admins to return
    :param offset: Offset of admins to return
    :return: AdminGetAllResponse: List of admins and total number of admins
    """
    mediator = GetAllMediator(
        crud_object=admin_crud,
        limit=limit,
        offset=offset,
    )
    mediator = await mediator()
    return AdminGetAllResponse(items=mediator["items"], total=mediator["total"])


@router.get(
    "/{admin_id}",
    response_model=AdminResponse,
    status_code=status.HTTP_200_OK,
    summary="get an admin",
    description="Get an admin by ID",
)
async def get_admin(
    admin_id: UUID,
) -> AdminResponse:
    """
    Get admin.

    Parameters:
    - admin_id: UUID, the ID of the admin

    Returns:
    - AdminResponse: The admin object
    """
    admin = await admin_crud.get_object(Admin, admin_id)

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

    admin = await get_admin_user_from_state(token=token)

    if not verify_password(data.old_password, admin.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The provided old password does not match",
        )

    admin.password = get_password_hash(data.new_password)
    await admin_crud.write_to_db(admin)
    return JSONResponse(content={"message": "Password was changed"})
