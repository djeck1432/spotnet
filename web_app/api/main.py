import os
from uuid import uuid4

from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from starlette.middleware.cors import CORSMiddleware

from web_app.db.database import Base, engine
from web_app.api.dashboard import router as dashboard_router
from web_app.api.form import router as form_router
from web_app.api.user import router as user_router

app = FastAPI()

Base.metadata.create_all(bind=engine)
# Set up the templates directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Add session middleware with a secret key
app.add_middleware(SessionMiddleware, secret_key=f"Secret:{str(uuid4())}")
# CORS middleware for React frontend
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_headers=["*"], allow_methods=["*"])

# Include the form and login routers
app.include_router(form_router)
app.include_router(dashboard_router)
app.include_router(user_router)
