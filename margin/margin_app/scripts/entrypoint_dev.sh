#!/bin/bash

echo "Activate virtual environment"


echo "Run migration with alembic"
poetry run alembic -c /app/alembic.ini upgrade head

echo "Starting the server ..."
poetry run fastapi run
