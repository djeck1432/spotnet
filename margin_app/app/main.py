"""
Main entry point for the application.
"""

import sys

from fastapi import FastAPI, Request
from loguru import logger

from app.api.margin_position import router as margin_position_router
from app.api.pools import router as pool_router
from app.api.user import router as user_router
from app.api.deposit import router as deposit_router

app = FastAPI()
app.include_router(pool_router, prefix="/api/pool", tags=["Pool"])
app.include_router(deposit_router, prefix="/api/deposit", tags=["Deposit"])
app.include_router(margin_position_router, tags=["MarginPosition"])
app.include_router(user_router, prefix="/api/user", tags=["User"])

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
    For example, closing database connections or cleaning up.
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


# Example route
@app.get("/")
async def read_root():
    """
    Basic endpoint for testing.
    """
    logger.info("Root endpoint accessed.")
    return {"message": "Welcome to the FastAPI application!"}


# Additional route
@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    logger.info("Health check endpoint accessed.")
    return {"status": "OK"}

app.include_router(deposit_router, prefix="/api/deposit", tags=["Deposit"])
