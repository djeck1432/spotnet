"""
Common API for get all endpoints.
"""

from typing import Any, Optional, Dict, Protocol
import logging
from fastapi import HTTPException, status


class PaginationCrudI(Protocol):
    """
    Interface for crud_object to require support of used pagination methods
    """

    async def get_objects(self, limit: Optional[int], offset: Optional[int]) -> Any:
        """Fetch objects with supplied limit and offset"""
        ...

    async def get_objects_amounts(self) -> int:
        """Fetch total amount of objects"""
        ...


class GetAllMediator:
    """
    Mediator for handling "get all" requests.
    """

    def __init__(
        self, crud_object: PaginationCrudI, limit: Optional[int], offset: Optional[int]
    ):
        self.crud_object = crud_object
        self.limit = limit
        self.offset = offset

    async def __call__(self) -> Dict:
        """
        Execute the CRUD functions and return results when the instance is called.

        Returns:
            Dict: Dictionary containing items and total count

        Raises:
            HTTPException: When database or other errors occur
        """
        try:
            items = await self.crud_object.get_objects(self.limit, self.offset)
            total = await self.crud_object.get_objects_amounts()

            return {"items": items, "total": total}
        except Exception as e:
            logging.error(f"Error in GetAllMediator: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Something went wrong while retrieving objects",
            )
