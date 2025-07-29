"""
CRUD operations for Admin model
"""

from typing import Optional, List
from sqlalchemy import select, func
from app.models.pool import UserPool
from app.services.auth.security import get_password_hash
from app.models.admin import Admin
from .base import DBConnector
from app.models.token import Token

class AdminCRUD(DBConnector):
    """
    AdminCRUD class for handling database operations for the Admin model.
    """

    async def get_by_email(self, email: str) -> Optional[Admin]:
        """
        Get admin by email.
        :param email: str
        :return: Optional[Admin]
        """
        return await self.get_object_by_field("email", email)

    async def get_super_admins(self) -> List[Admin]:
        """
        Get all super admins.
        :return: List[Admin]
        """
        async with self.session() as db:
            result = await db.execute(
                select(self.model).where(self.model.is_super_admin.is_(True))
            )
            return list(result.scalars().all())

    async def create_admin(
        self,
        email: str,
        name: Optional[str] = None,
        password: Optional[str] = None,
        is_super_admin: bool = False,
    ) -> Admin:
        """
        Create a new admin in the database.
        :param email: str
        :param name: Optional[str]
        :param password: Optional[str]
        :param is_super_admin: bool
        :return: Admin
        """
        hashed_password = get_password_hash(password) if password else None
        new_admin = Admin(
            name=name,
            email=email,
            password=hashed_password,
            is_super_admin=is_super_admin,
        )
        return await self.write_to_db(new_admin)

    async def update_admin(self, admin_id: int, model: Admin) -> Optional[Admin]:
        """
        Update an admin in the database.
        :param admin_id: int
        :param model: Admin - The admin model with updated fields
        :return: Optional[Admin]
        """
        admin = await self.get_object_by_field("id", admin_id)
        if not admin:
            return None

        # Update fields from the model
        for field in ["name", "email", "is_super_admin"]:
            if hasattr(model, field):
                setattr(admin, field, getattr(model, field))

        # Handle password separately to ensure hashing
        if hasattr(model, "password") and model.password:
            admin.password = get_password_hash(model.password)

        return await self.write_to_db(admin)
    
    async def get_token_statistics(self):
        """get token statistics including total amount per token"""
        query = (
            select(
                Token.name,
                func.sum(UserPool.amount).label("total_amount")
        )
        .join(Token, UserPool.token_id == Token.id)
        .group_by(Token.name)
        )
    
        result = await self.session.execute(query)
        return result.all()


admin_crud = AdminCRUD(Admin)
