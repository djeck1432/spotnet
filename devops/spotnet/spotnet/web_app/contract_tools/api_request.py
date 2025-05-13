"""
This module handles API requests.
"""

import aiohttp


class APIRequest:
    """
    A class to send asynchronous requests to an API.
    """

    DEFAULT_HEADER = {
        "User-Agent": "Mozilla/5.0",  # Mimic a browser request
        "Accept": "application/json",  # Ensure we expect a JSON response
    }

    def __init__(self, base_url: str):
        self.base_url = base_url

    async def fetch(self, endpoint: str, params: dict = None, headers: dict = None):
        """
        Send a GET request asynchronously with specific headers and query parameters.

        :param endpoint: The API endpoint to send the request to.
        :param params: Query parameters to include in the request.
        :param headers: Headers to include in the request.
        :return: The response from the API as JSON.
        """
        # Merge default headers with any user-provided headers
        request_headers = self.DEFAULT_HEADER.copy()  # Start with default headers
        if headers:
            request_headers.update(headers)

        async with aiohttp.ClientSession() as session:
            url = f"{self.base_url}{endpoint}"
            async with session.get(
                url, params=params, headers=request_headers
            ) as response:
                if response.ok:
                    return await response.json()
                return {}

    async def post(self, endpoint: str, data: dict = None, headers: dict = None):
        """
        Send a POST request asynchronously.

        :param endpoint: The API endpoint to send the request to.
        :param data: The data to include in the POST request (as a JSON body).
        :param headers: Headers to include in the request.
        :return: The response from the API as JSON.
        """
        async with aiohttp.ClientSession() as session:
            url = f"{self.base_url}{endpoint}"
            async with session.post(url, json=data, headers=headers) as response:
                response.raise_for_status()  # Raise an exception for bad status codes
                return await response.json()

    async def fetch_text(
        self, endpoint: str, params: dict = None, headers: dict = None
    ):
        """
        Send a GET request asynchronously and return text response.

        :param endpoint: The API endpoint to send the request to.
        :param params: Query parameters to include in the request.
        :param headers: Headers to include in the request.
        :return: The response from the API as text.
        """
        async with aiohttp.ClientSession() as session:
            url = f"{self.base_url}{endpoint}"
            async with session.get(url, params=params, headers=headers) as response:
                response.raise_for_status()  # Raise an exception for bad status codes
                return await response.text()


# Example usage:
async def main():
    """
    Main function to demonstrate APIRequest usage.
    """
    # Initialize the APIRequest with a base URL
    api = APIRequest(base_url="https://portfolio.argent.xyz")

    # Example: Fetch data from an endpoint asynchronously
    response = await api.fetch(
        "/overview/0x020281104e6cb5884dabcdf3be376cf4ff7b680741a7bb20e5e07c26cd4870af"
    )
    print(response)
