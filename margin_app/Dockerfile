FROM python:3.13-slim
# TODO: Adjust if needed

# Environment settings
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Set PATH for Poetry
ENV PATH "/root/.local/bin:$PATH"

# Add system-level dependencies (including gcc and npm)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       libpq-dev gcc g++ make libffi-dev build-essential \
       curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -

# Create app directory
RUN mkdir /app
WORKDIR /app

# Copy the pyproject.toml and poetry.lock files into container's /app/ directory
COPY pyproject.toml poetry.lock /app/

# Install dependencies from the poetry.lock file
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-root

# Copy the rest of the application code
COPY ./app /app/app
COPY alembic.ini /app
COPY ./scripts/entrypoint_dev.sh /app

# Set the entrypoint script as executable
RUN chmod +x /app/entrypoint_dev.sh

ENTRYPOINT ["bash", "/app/entrypoint_dev.sh"]

EXPOSE 8000
