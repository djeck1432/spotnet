"""
API endpoints for admin management.

This module provides REST API endpoints for admin user management including
creation, retrieval, password reset, and profile updates. All endpoints
except password reset require authentication.
"""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status, Request
from loguru import logger
from sqlalchemy.exc import IntegrityError

from app.api.common import GetAllMediator
from app.crud.admin import admin_crud
from app.schemas.admin import (
    AdminRequest,
    AdminResponse,
    AdminGetAllResponse,
    AdminUpdateRequest,
)
from app.services.auth.base import get_admin_user_from_state, get_current_user
from app.services.auth.security import get_password_hash, verify_password
from app.services.emails import email_service
from fastapi.responses import JSONResponse
from pydantic import EmailStr
from app.db.sessions import get_db
from app.schemas.dashboard import AssetsResponse, Asset
from fastapi import Depends 
from sqlalchemy.orm import Session   

router = APIRouter(prefix="")


@router.post(
    "/add",
    response_model=AdminResponse,
    status_code=status.HTTP_201_CREATED,
    summary="add a new admin",
    description="Adds a new admin in the application",
)
async def add_admin(data: AdminRequest, request: Request) -> AdminResponse:
    """
    Add a new admin with the provided admin data.

    Parameters:
        data: The admin data to add
        request: The request object containing the authenticated user state

    Returns:
        Added admin

    Raises:
        HTTPException: If there's an error in a addition the admin
    """

    current_admin = await get_admin_user_from_state(request)

    if not current_admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required"
        )

    if not current_admin.is_super_admin:
        logger.warning(
            f"Non-superadmin user {current_admin.email} attempted to create admin"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only superadmins can create new admin users",
        )

    try:
        new_admin = await admin_crud.create_admin(
            email=data.email, name=data.name, password=None, is_super_admin=False
        )

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
    result = await mediator()
    return result


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
    admin = await admin_crud.get_object(admin_id)

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
    "/reset_password/{reset_token}",
    status_code=status.HTTP_200_OK,
    summary="password reset for admin",
    description="Reset password for admin using token",
)
async def reset_password(
    reset_token: str, new_password: str = Query(..., min_length=1)
):
    """
    Reset admin password using a secure reset token.

    This endpoint allows admin users to reset their password using a valid
    reset token received via email. The token is verified, the admin is
    retrieved, and their password is securely hashed and updated.

    Args:
        reset_token: JWT token containing admin email and expiration.
        new_password: New password with minimum length of 1 character.

    Returns:
        JSONResponse: Success message indicating password was reset.

    Raises:
        HTTPException: 400 for invalid/expired tokens, 404 for admin not found,
                      500 for server errors.
    """
    try:
        admin = await get_current_user(reset_token)

        if not admin:
            logger.error("Admin not found for the provided token")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Admin not found",
            )

        admin.password = get_password_hash(new_password)
        await admin_crud.write_to_db(admin)

        logger.info(f"Password successfully reset for admin: {admin.email}")
        return JSONResponse(content={"message": "Password was successfully reset"})

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during password reset: {str(e)}")
        if "expired" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset token has expired",
            )
        elif "invalid" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token",
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while resetting the password",
            )


@router.put(
    "/{admin_id}",
    response_model=AdminResponse,
    status_code=status.HTTP_200_OK,
    summary="Update admin",
    description="Update the name of an admin by ID",
)
async def update_admin_name(
    admin_id: UUID,
    data: AdminUpdateRequest,
    request: Request,
) -> AdminResponse:
    """
    Update an admin's name.

    Parameters:
    - admin_id: UUID of the admin to update
    - data: AdminUpdateRequest containing updated fields
    - request: Request object containing authenticated admin user

    Returns:
    - AdminResponse: Updated admin data

    Raises:
    - HTTPException: If admin is not found or user is not authenticated
    """
    current_admin = await get_admin_user_from_state(request)

    if not current_admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required"
        )

    admin = await admin_crud.get_object(admin_id)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found."
        )

    if data.name is not None:
        admin.name = data.name

    updated_admin = await admin_crud.write_to_db(admin)
    return AdminResponse(
        id=updated_admin.id, name=updated_admin.name, email=updated_admin.email
    )


@router.get("/admin/assets", response_model=AssetsResponse)
def get_assets(db: Session = Depends(get_db)):
    """
    Retrieve the assets and their statistics."""
    stats = {}  # Replace with actual function call to retrieve asset statistics

    assets_list = [
        Asset(symbol=symbol, amount=data["amount"], value=data["value"])
        for symbol, data in stats["assets"].items()
    ]

    return AssetsResponse(total=stats["total"], assets=assets_list)
