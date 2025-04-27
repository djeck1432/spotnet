"""
app/tests/api/deposit.py

Test Cases:
- test_deposit_creation_success: Test the successful creation of a proposal.
- test_deposit_update_success: Test updating a proposal successfully.
- test_deposit_update_for_invalid_id: Test updating a proposal with invalid deposit id.
- test_deposits_creation_with_data_cases: Test creating proposals with various data combinations
- test_update_invalid_deposits: Test updating proposals with invalid data.
"""

import uuid
import pytest

from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient


BASE_URL = "/api/deposit"
MOCK_ID = str(uuid.uuid4())

MOCK_CREATION_RESPONSE = {
    "id": MOCK_ID,
    "user_id": MOCK_ID,
    "token": "USDC",
    "amount": "1000.00",
    "transaction_id": "tx_12345abcde",
    "created_at": "2022-01-01T00:00:00",
    "updated_at": "2022-01-01T00:00:00",
}


@pytest.mark.anyio
async def test_deposit_creation_success(client: TestClient):
    """
    Test the successful creation of a deposit.

    This test ensures that a deposit can be created successfully by sending
    a POST request to the API endpoint.
    It mocks the `create_deposit` method of the `DepositCRUD` class
    to return a deposit response and verifies that the
    response from the API matches the mocked response.

    :param client: TestClient instance for making requests to the API.
    """
    with patch(
        "app.crud.deposit.DepositCRUD.create_deposit", new_callable=AsyncMock
    ) as mock_create_deposit:
        mock_create_deposit.return_value = MOCK_CREATION_RESPONSE
        print("Mock return value:", mock_create_deposit.return_value)

        response = client.post(
            f"{BASE_URL}",
            json={
                "user_id": MOCK_ID,
                "token": "USDC",
                "amount": "1000.00",
                "transaction_id": "tx_12345abcde",
            },
        )

        print(
            "Response For Edoka:", response.status_code, response.json(), response.text
        )

        assert response.status_code == 201
        assert response.json() == {
            "id": MOCK_CREATION_RESPONSE["id"],
            "created_at": MOCK_CREATION_RESPONSE["created_at"],
            "updated_at": MOCK_CREATION_RESPONSE["updated_at"],
        }

        mock_create_deposit.assert_called_once()


@pytest.mark.anyio
async def test_deposit_update_success(client: TestClient):
    """
    Test updating a deposit successfully.

    This test ensures that a deposit can be updated successfully by sending
    a POST request to the API endpoint.
    It mocks the `update_deposit` method of the `DepositCRUD` class
    to return an updated deposit response and verifies that the
    response from the API matches the mocked response.

    :param client: TestClient instance for making requests to the API.
    """
    mock_update_response = MOCK_CREATION_RESPONSE
    mock_update_response["amount"] = "2000.00"

    with patch(
        "app.crud.deposit.DepositCRUD.update_deposit", new_callable=AsyncMock
    ) as mock_update_deposit:
        mock_update_deposit.return_value = mock_update_response

        response = client.post(
            f"{BASE_URL}/{MOCK_ID}",
            json={"amount": "2000.00"},
        )

        assert response.status_code == 200
        assert response.json() == {
            "id": mock_update_response["id"],
            "created_at": mock_update_response["created_at"],
            "updated_at": mock_update_response["updated_at"],
        }

        mock_update_deposit.assert_called_once()


@pytest.mark.anyio
async def test_deposit_update_for_invalid_id(client: TestClient):
    """
    Test updating a deposit with invalid data.

    This test ensures that updating a deposit with invalid (non UUID) id
    results in validation error (422)
    :param client: TestClient instance for making requests to the API.
    """
    with patch(
        "app.crud.deposit.DepositCRUD.update_deposit", new_callable=AsyncMock
    ) as mock_update_deposit:
        response = client.post(
            f"{BASE_URL}/123",
            json={"amount": "2000.00"},
        )

        assert response.status_code == 422
        assert "detail" in response.json()

        mock_update_deposit.assert_not_awaited()


@pytest.mark.anyio
def test_update_deposit_not_found(client: TestClient):
    """
    This test ensures that if deposit is not found by supplied id
    hence update_deposit returns None api endpoint must return 404 error

    :param client: TestClient instance for making requests to the API.
    """
    with patch(
        "app.crud.deposit.DepositCRUD.update_deposit", new_callable=AsyncMock
    ) as mock_update_deposit:
        mock_update_deposit.return_value = None

        response = client.post(
            f"{BASE_URL}/{MOCK_ID}",
            json={"amount": "2000.00"},
        )

        assert response.status_code == 404
        assert "detail" in response.json()

        mock_update_deposit.assert_called_once()


@pytest.mark.parametrize(
    "user_id, token, amount, transaction_id, expected_status",
    [
        (MOCK_ID, "USDC", "5000.00", "tx_12345abcde", 201),
        (MOCK_ID, "USDC", 500, "tx_12345abcde", 201),
        (MOCK_ID, None, None, "", 422),
        ("MOCK_UUID", None, "5000.00", "", 422),
        (1, "USDC", 1000, None, 422),
        (MOCK_ID, "USDC", "5000", None, 422),
    ],
)
@pytest.mark.anyio
async def test_deposits_creation_with_data_cases(
    client: TestClient, user_id, token, amount, transaction_id, expected_status
):
    """
    Test creating deposits with various forms of data.

    This test ensures that deposits can be created with different forms of data.
    It uses the `DepositTestCase` dataclass to define different test cases
    with different combinations of user_id, token, amount, and transaction_id.
    The test verifies that the API returns the expected status code for each case.

    :param client: TestClient instance for making requests to the API

    :param user_id: ID of the user
    :param token: Token used for the deposit
    :param amount: Amount of Deposit
    :param transaction_id: Transaction id of the deposit
    :param expected_status: Expected status code of the response
    """
    with patch(
        "app.crud.deposit.DepositCRUD.create_deposit", new_callable=AsyncMock
    ) as mock_create_deposit:
        mock_create_deposit.return_value = MOCK_CREATION_RESPONSE
        response = client.post(
            f"{BASE_URL}",
            json={
                "user_id": user_id,
                "token": token,
                "amount": str(amount),
                "transaction_id": transaction_id,
            },
        )

        assert response.status_code == expected_status
        if expected_status != 201:
            assert "detail" in response.json()


@pytest.mark.anyio
def test_get_deposit_by_id_success(client: TestClient):
    """
    Test getting a deposit by ID successfully.

    This test ensures that a deposit can be retrieved successfully
    by sending a GET request to the API endpoint.
    It mocks the `get_object` method of the `DepositCRUD` class
    to return a deposit response and verifies that the
    response from the API matches the mocked response.

    :param client: TestClient instance for making requests to the API.
    """
    with patch(
        "app.crud.deposit.DepositCRUD.get_object", new_callable=AsyncMock
    ) as mock_get_object:
        mock_get_object.return_value = {
            "id": MOCK_ID,
            "created_at": "2022-01-01T00:00:00",
            "updated_at": "2022-01-01T00:00:00",
        }

        response = client.get(f"{BASE_URL}/{MOCK_ID}")

        assert response.status_code == 200
        assert response.json() == mock_get_object.return_value

        mock_get_object.assert_called_once()


@pytest.mark.anyio
def test_get_deposit_by_invalid_id(client: TestClient):
    """
    Test getting a deposit by invalid ID.

    This test ensures that trying to retrieve a deposit with an invalid ID
    results in a 404 Not Found response from the API.
    It mocks the `get_object` method of the `DepositCRUD` class
    to return None and verifies that the API returns a 404 response.

    :param client: TestClient instance for making requests to the API.
    """
    with patch(
        "app.crud.deposit.DepositCRUD.get_object", new_callable=AsyncMock
    ) as mock_get_object:
        mock_get_object.return_value = None

        response = client.get(f"{BASE_URL}/{MOCK_ID}")

        assert response.status_code == 404
        assert "detail" in response.json()

        mock_get_object.assert_called_once()
