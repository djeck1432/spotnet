FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy pyproject files from the root of the build context
COPY pyproject.toml poetry.lock ./

# Install dependencies globally (no venv)
RUN poetry config virtualenvs.create false \
  && poetry install --no-root

# Copy telegram bot code
COPY app/telegram ./telegram

# Run the bot
CMD ["python", "-m", "telegram.main"]
