#!/bin/bash

docker compose -f devops/docker-compose.back.yaml up --build

echo "Installing Poetry globally..."
curl -sSL https://install.python-poetry.org | python3 -

echo "Installing all dependencies for \"data_handler\" with Poetry..."
poetry install

echo "Activating ..."
poetry shell

echo "Applying latest existing migrations..."
poetry run alembic -c spotnet/web_app/alembic.ini upgrade head

echo "Generating new migration..."
poetry run alembic -c spotnet/web_app/alembic.ini revision --autogenerate -m "Migration"