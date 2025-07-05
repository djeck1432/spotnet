"""
Main FastAPI application entry point.
"""

import sys

from fastapi import FastAPI, Request, Depends
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.cors import CORSMiddleware
from loguru import logger
from starlette.responses import JSONResponse

from app.api.admin import router as admin_router
from app.api.deposit import router as deposit_router
from app.core.config import settings
from app.api.margin_position import router as margin_position_router
from app.api.order import router as order_router
from app.api.pools import router as pool_router
from app.api.user import router as user_router
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.services.auth.base import get_current_user
from app.models.admin import Admin

# Initialize FastAPI app
app = FastAPI(
    title="Margin Trading API",
    description="API for managing margin trading positions",
    version="1.0.0",
)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.secret_key,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(pool_router, prefix="/api/pool", tags=["Pool"])
app.include_router(
    margin_position_router, prefix="/api/margin", tags=["MarginPosition"]
)
app.include_router(user_router, prefix="/api/user", tags=["User"])
app.include_router(deposit_router, prefix="/api/deposit", tags=["Deposit"])
app.include_router(order_router, prefix="/api/order", tags=["Order"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])

# Configure Loguru
logger.remove()  # Remove default logger to configure custom settings
logger.add(
    sys.stdout,
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}",
    level="INFO",
    enqueue=True,
    backtrace=True,
    diagnose=True,
)


@app.on_event("startup")
async def startup_event():
    """
    Code to run when the app starts.
    For example, database connection setup or loading configurations.
    """
    logger.info("Application startup: Initializing resources.")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Code to run when the app shuts down.
    For example, closing database connections or cleaning up resources.
    """
    logger.info("Application shutdown: Cleaning up resources.")


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Middleware to log HTTP requests and responses.
    """
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code} {request.url}")
    return response


@app.middleware("http")
async def auth_admin_user(request: Request, call_next):
    """
    Middleware to authenticate admin users.
    """
    if not request.url.path.startswith("/api/admin"):
        return await call_next(request)
    
    public_endpoints = [
        "/api/admin/reset_password/",
        "/api/admin/change_password"
    ]

    for endpoint in public_endpoints:
        if request.url.path.startswith(endpoint):
            return await call_next(request)
        
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            logger.error("Missing authorization header.")
            return JSONResponse(
                status_code=401, content={"detail": "Missing authorization header."}
            )

        header_parts = auth_header.split()
        if len(header_parts) != 2:
            logger.error("Invalid authorization header format.")
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid authorization header format."},
            )

        auth_scheme, token = header_parts
        if auth_scheme.lower() != "bearer":
            logger.error("Invalid authentication scheme.")
            return JSONResponse(
                status_code=401, content={"detail": "Invalid authentication scheme."}
            )

        request.state.admin_user = await get_current_user(token)
    except Exception as e:
        logger.error(f"Error authenticating admin user: {e}")
        return JSONResponse(
            status_code=401, content={"detail": "Authentication error."}
        )

    return await call_next(request)


# Additional route
@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    logger.info("Health check endpoint accessed.")
    return {"status": "OK"}
