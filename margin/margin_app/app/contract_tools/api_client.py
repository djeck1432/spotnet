"""
This module contains mixins for admin-related contract interactions.
"""

import httpx
import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)

class BaseAPIClient:
    """A robust, reusable asynchronous API client using httpx."""

    def __init__(self, base_url: str, headers: Optional[Dict[str, str]] = None):
        """
        Initializes the API client.

        :param base_url: The base URL for all API requests.
        :param headers: Optional dictionary of headers to send with each request.
        """
        self.base_url = base_url
        self.headers = headers or {}

    async def request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        json: Optional[Dict[str, Any]] = None,
        timeout: int = 15
    ) -> Optional[Any]:
        """
        Makes an asynchronous HTTP request.

        :param method: HTTP method (e.g., 'GET', 'POST').
        :param endpoint: API endpoint path (e.g., '/prices').
        :param params: URL query parameters.
        :param json: JSON body for POST/PUT requests.
        :param timeout: Request timeout in seconds.
        :return: The JSON response from the API, or None if an error occurs.
        """
        url = f"{self.base_url}{endpoint}"
        try:
            async with httpx.AsyncClient() as client:
                response = await client.request(
                    method=method,
                    url=url,
                    params=params,
                    json=json,
                    headers=self.headers,
                    timeout=timeout,
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(
                f"HTTP error for {e.request.url}: {e.response.status_code} - {e.response.text}"
            )
            return None
        except httpx.RequestError as e:
            logger.error(f"Request error for {e.request.url}: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"An unexpected error occurred: {str(e)}")
            return None

    async def get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Optional[Any]:
        """
        Convenience method for making a GET request.

        :param endpoint: API endpoint path.
        :param params: URL query parameters.
        :return: The JSON response from the API, or None if an error occurs.
        """
        return await self.request('GET', endpoint, params=params)
