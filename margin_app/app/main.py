"""
Main entry point for the application.
"""

from fastapi import FastAPI

from app.api.deposit import router as deposit_router

app = FastAPI()
app.include_router(deposit_router, prefix="/api/deposit", tags=["Deposit"])
