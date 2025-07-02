"""
API endpoints for admin management.
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
    AdminResetPassword,
    AdminGetAllResponse,
    AdminUpdateRequest,
    AssetStatisticsResponse,
    AssetStatisticResponse
)
from app.services.auth.base import get_admin_user_from_state
from app.services.auth.security import get_password_hash, verify_password
from app.services.emails import email_service
from app.contract_tools.mixins.admin import AdminMixin
from fastapi.responses import JSONResponse
from pydantic import EmailStr
from decimal import Decimal

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
    request: Request
) -> AdminResponse:
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
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )

    if not current_admin.is_super_admin:
        logger.warning(
            f"Non-superadmin user {current_admin.email} attempted to create admin"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only superadmins can create new admin users"
        )

    try:
        new_admin = await admin_crud.create_admin(
            email=data.email,
            name=data.name,
            password=None,
            is_super_admin=False
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


@router.get(
    "/statistic/assets",
    response_model=AssetStatisticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get asset statistics",
    description="Retrieve asset statistics including total amounts and values for all tokens",
)
async def get_asset_statistics(
    request: Request
) -> AssetStatisticsResponse:
    """
    Get asset statistics by calculating the total amounts across all user pools
    and multiplying them by their current prices.

    This endpoint:
    1. Retrieves all user pools from the database
    2. Groups them by token and sums the amounts
    3. Fetches current token prices from AVNU API
    4. Calculates total values for each token
    5. Returns comprehensive asset statistics

    Parameters:
        request: The request object containing the authenticated user state

    Returns:
        AssetStatisticsResponse: Comprehensive asset statistics including individual
                                token data and total portfolio value

    Raises:
        HTTPException: If authentication fails or there's an error calculating statistics
    """
    # Verify admin authentication
    current_admin = await get_admin_user_from_state(request)
    if not current_admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Authentication error."
        )

    try:
        logger.info("Starting asset statistics calculation for admin request")
        
        # Get asset statistics using the AdminMixin
        asset_data = await AdminMixin.get_asset_statistics()
        
        if not asset_data:
            logger.warning("No asset data found")
            return AssetStatisticsResponse(
                assets=[], 
                total_portfolio_value=Decimal('0')
            )

        # Convert to response schema and calculate total portfolio value
        assets = []
        total_portfolio_value = Decimal('0')
        
        for asset in asset_data:
            asset_response = AssetStatisticResponse(
                token=asset['token'],
                total_amount=asset['total_amount'],
                total_value=asset['total_value']
            )
            assets.append(asset_response)
            total_portfolio_value += asset['total_value']

        logger.info(f"Successfully calculated statistics for {len(assets)} assets, total portfolio value: {total_portfolio_value}")
        
        return AssetStatisticsResponse(
            assets=assets,
            total_portfolio_value=total_portfolio_value
        )

    except Exception as e:
        logger.error(f"Failed to calculate asset statistics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating asset statistics: {str(e)}"
        ) from e
