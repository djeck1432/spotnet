"""
API endpoints for admin management.
"""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from loguru import logger
from sqlalchemy.exc import IntegrityError

from app.crud.base import DBConnector
from app.models.admin import Admin
from app.schemas.admin import AdminRequest, AdminResponse

router = APIRouter(prefix="/admin")


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
        password=data.password,
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found.")

    return AdminResponse(id=admin.id, name=admin.name, email=admin.email)
