FROM python:3.12-slim

WORKDIR /app

# Copy poetry files from root of context
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN pip install poetry && poetry install --no-root

# Copy the telegram bot code from telegram folder
COPY app/telegram ./telegram

CMD ["python", "-m", "telegram.main"]
