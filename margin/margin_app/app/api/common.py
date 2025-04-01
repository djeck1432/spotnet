"""
Common API for get all endpoints.
"""

# Define a generic mediator for "get all" endpoints
from typing import Any, Optional


class GetAllMediator:
    """
    Mediator for handling "get all" requests.
    """

    def __init__(self, crud_object: Any, limit: Optional[int], offset: int):
        self.crud_object = crud_object
        self.limit = limit
        self.offset = offset

    async def __call__(self):
        """
        Execute the CRUD functions and return results when the instance is called.
        """
        total = await self.crud_object.get_objects_amounts()
        if total == 0:
            return {
                "items": [],
                "total": 0,
            }
        return {
            "items": await self.crud_object.get_objects(self.limit, self.offset),
            "total": total,
        }
