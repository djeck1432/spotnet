"""
Main FastAPI application module for the SPOTNET API.

This module sets up the FastAPI application 
and includes middleware for session management and CORS.
It also includes routers for the dashboard, position, and user endpoints.
"""

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

# Set up the templates directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Add session middleware with a secret key
app.add_middleware(SessionMiddleware, secret_key=f"Secret:{str(uuid4())}")
# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_headers=["*"], allow_methods=["*"]
)

# Include the form and login routers
app.include_router(position_router)
app.include_router(dashboard_router)
app.include_router(user_router)
