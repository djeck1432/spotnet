#!/bin/bash

echo "Activate virtual environment"
source $(poetry env info --path)/bin/activate

echo "Run migration with alembic"
poetry run alembic -c /app/alembic.ini upgrade head

echo "Starting the server ..."
poetry run fastapi run
