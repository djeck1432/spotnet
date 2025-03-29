"""
CRUD operations for Admin model
"""

from typing import Optional
from app.models.admin import Admin
from .base import DBConnector

class AdminCRUD(DBConnector):
    """
    AdminCRUD class for handling database operations for the Admin model.
    """

    async def get_object_by_field(self, field: str, value:str, model = Admin) -> Optional[Admin]:
        """
        Retrieves an object by a specified field from the database.
        :param field: str = None
        :param value: str = None
        :param model: = Admin
        :return: Base | None
        """
        return await super().get_object_by_field(model, field, value)


    async def get_all(
        self, limit: Optional[int] = None, offset: Optional[int] = None
    ) -> list[Admin]:
        """
        Retrieves all admins.
        :param limit: Optional[int] - max admins to be retrieved
        :param offset: Optional[int] - start retrieving at.
        :return: list[Admin]
        """
        return await self.get_objects(Admin, limit, offset)


    async def create_admin(self, email: str, name: str, password: Optional[str] = None) -> Admin:
        """
        Create a new admin in the database.
        :param email: str
        :param name: str
        :param password: str
        :return: Admin
        """
        new_admin = Admin(
            name=name,
            email=email,
            password=password,
        )
        return await self.write_to_db(new_admin)

admin_crud = AdminCRUD()
