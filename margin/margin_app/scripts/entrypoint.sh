echo "Run migration with alembic"
source /src/.venv/bin/activate
poetry run alembic upgrade head

echo "Starting the server ..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
