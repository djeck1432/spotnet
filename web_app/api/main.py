import os
from uuid import uuid4

from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.cors import CORSMiddleware

from web_app.api.dashboard import router as dashboard_router
from web_app.api.position import router as position_router
from web_app.api.user import router as user_router

app = FastAPI(
    title="SPOTNET API",
    description="""
    This API allows users to:
    
    1. Deposit collateral (ETH) into a lending protocol (ZkLend or Nostra) on Starknet.
    2. Borrow stablecoins (USDC) against their collateral.
    3. Trade on Starknet-based AMMs.
    4. Re-deposit and re-borrow assets for increased leverage.
    """,
    version="0.1.0",
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    }
)

# Set up the templates directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Add session middleware with a secret key
app.add_middleware(SessionMiddleware, secret_key=f"Secret:{str(uuid4())}")
# CORS middleware for React frontend
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_headers=["*"], allow_methods=["*"])

# Include the form and login routers
app.include_router(position_router)
app.include_router(dashboard_router)
app.include_router(user_router)
