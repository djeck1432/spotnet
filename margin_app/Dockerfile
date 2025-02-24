FROM python:3.12-slim
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

WORKDIR /src

# Copy all files
COPY . /src/

# Install poetry dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-root

RUN chmod +x /src/scripts/entrypoint.sh

ENTRYPOINT ["bash", "/src/scripts/entrypoint.sh"]

EXPOSE 8000
