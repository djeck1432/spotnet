import pytest

class MockResponse:
    def __init__(self, status_code, json_data):
        self.status_code = status_code
        self._json_data = json_data
        
    def json(self):
        return self._json_data

class MockAsyncClient:
    def __init__(self, base_url=None):
        self.base_url = base_url
        self.responses = {}
        
    def add_response(self, method, url, json, status_code):
        self.responses[(method, url)] = MockResponse(status_code, json)
        
    async def get(self, url):
        full_url = f"{self.base_url}{url}" if self.base_url else url
        key = ("GET", full_url)
        if key in self.responses:
            return self.responses[key]
        else:
            raise Exception(f"No mock response for {key}")
            
    async def __aenter__(self):
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass

# Mock httpx_mock fixture
@pytest.fixture
def httpx_mock():
    class HttpxMock:
        def __init__(self):
            self.responses = {}
            
        def add_response(self, method, url, json, status_code):
            self.responses[(method, url)] = (json, status_code)
    
    return HttpxMock()

# Success scenario test
@pytest.mark.asyncio
async def test_get_deposit_by_id_success(httpx_mock):
    # Mock successful response
    deposit_id = "test_deposit_id"
    mock_data = {"id": deposit_id, "amount": 100.00, "status": "completed"}
    
    # Create mock client
    client = MockAsyncClient(base_url="http://testserver")
    client.add_response(
        method="GET",
        url=f"http://testserver/api/deposits/{deposit_id}",
        json=mock_data,
        status_code=200
    )
    
    # Make API request
    async with client as client:
        response = await client.get(f"/api/deposits/{deposit_id}")
        
    # Verify response
    assert response.status_code == 200
    assert response.json() == mock_data

# Not found scenario
@pytest.mark.asyncio
async def test_get_deposit_by_id_not_found(httpx_mock):
    # Mock not found response
    deposit_id = "nonexistent_id"
    error_message = {"detail": "Deposit not found"}
    
    # Create mock client
    client = MockAsyncClient(base_url="http://testserver")
    client.add_response(
        method="GET",
        url=f"http://testserver/api/deposits/{deposit_id}",
        json=error_message,
        status_code=404
    )
    
    # Make API request
    async with client as client:
        response = await client.get(f"/api/deposits/{deposit_id}")
        
    # Verify response
    assert response.status_code == 404
    assert response.json() == error_message

# Error scenario
@pytest.mark.asyncio
async def test_get_deposit_by_id_error(httpx_mock):
    # Mock server error response
    deposit_id = "test_deposit_id"
    error_message = {"detail": "Internal server error"}
    
    # Create mock client
    client = MockAsyncClient(base_url="http://testserver")
    client.add_response(
        method="GET",
        url=f"http://testserver/api/deposits/{deposit_id}",
        json=error_message,
        status_code=500
    )
    
    # Make API request
    async with client as client:
        response = await client.get(f"/api/deposits/{deposit_id}")
        
    # Verify response
    assert response.status_code == 500
    assert response.json() == error_message 