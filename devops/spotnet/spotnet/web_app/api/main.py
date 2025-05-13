"""
Main FastAPI application module for the SPOTNET API.

This module sets up the FastAPI application 
and includes middleware for session management and CORS.
It also includes routers for the dashboard, position, and user endpoints.
"""

import os
from uuid import uuid4

from fastapi import FastAPI
from starknet_py.contract import Contract
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from web_app.api.dashboard import router as dashboard_router
from web_app.api.position import router as position_router
from web_app.api.telegram import router as telegram_router
from web_app.api.user import router as user_router
from web_app.api.vault import router as vault_router
from web_app.api.leaderboard import router as leaderboard_router
from web_app.contract_tools.blockchain_call import CLIENT
from web_app.contract_tools.constants import EKUBO_MAINNET_ADDRESS

# Initialize Sentry SDK if in production
if os.getenv("ENV_VERSION") == "PROD":
    import sentry_sdk

    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        traces_sample_rate=1.0,
        _experiments={
            "continuous_profiling_auto_start": True,
        },
    )


app = FastAPI(
    title="SPOTNET API",
    description=(
        "An API that supports depositing collateral, borrowing stablecoins, "
        "trading on AMMs, and managing user positions on Starknet."
    ),
    version="0.1.0",
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# Add session middleware with a secret key
app.add_middleware(SessionMiddleware, secret_key=f"Secret:{str(uuid4())}")
# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_headers=["*"], allow_methods=["*"]
)


@app.on_event("startup")
async def startup_event():
    """
    Initialize the Ekubo contract instance on startup.
    """
    app.state.ekubo_contract = await Contract.from_address(
        EKUBO_MAINNET_ADDRESS, provider=CLIENT.client
    )


# Include the form and login routers
app.include_router(position_router)
app.include_router(dashboard_router)
app.include_router(user_router)
app.include_router(telegram_router)
app.include_router(vault_router)
app.include_router(leaderboard_router)
