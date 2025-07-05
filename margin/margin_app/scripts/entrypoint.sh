echo "Run migration with alembic"
poetry run alembic upgrade head

echo "Starting the server ..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
