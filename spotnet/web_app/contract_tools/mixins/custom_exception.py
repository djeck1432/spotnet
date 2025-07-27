"""
This module contains custom errors for the database
"""


class HealthRatioLevelLowException(Exception):
    """
    Exception raised when a user's health ratio level is lower than 1.1.
    """

    def __init__(self, user_id: int, health_ratio_level: float):
        self.message = (
            f"User {user_id} has a low health ratio level: {health_ratio_level}"
        )
        super().__init__(self.message)
