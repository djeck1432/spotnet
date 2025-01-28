What

The functionality allows users to leverage their positions on assets (e.g., ETH) by looping through lending protocols (ZkLend, Nostra) and automated market makers (AMMs). Users deposit collateral into a lending protocol, borrow stablecoins, trade on AMMs, and repeat this loop to increase their holdings. The process allows for up to 5x leverage, providing more utility and liquidity to the DeFi ecosystem.

Why

The spot leveraging concept fills a gap in the Starknet ecosystem by enabling users to amplify their positions without the need for perpetual contracts. This improves liquidity and utility for decentralized finance (DeFi) platforms on Starknet, providing a tool that is currently unavailable but highly demanded by users and protocols like ZkLend and Nostra. It allows for stable, long-term leveraged positions at lower costs and risk, which are essential for users aiming to increase exposure without facing the volatility of perpetual contracts.

How

1. Deposit Collateral: Users deposit assets (e.g., ETH) into a lending protocol like ZkLend or Nostra - interaction with a smart contract on Starknet
2. Borrow Stablecoins: Users borrow stablecoins (e.g., USDC) against their deposited collateral - The smart contract on Starknet allows users to borrow stablecoins
3. Trading on AMMs: Borrowed stablecoins are swapped for more ETH or the initial asset via AMMs (Starknet-based).
4. Re-Deposit and Re-Borrow: The newly acquired ETH is re-deposited as additional collateral to borrow more stablecoins.
5. Repeating the Loop: This loop repeats, increasing the user's leverage until they reach the desired level or the borrowing limit.

# Development Environment Setup

This guide explains how to start the development environment for the project using Docker Compose. It includes setting up the backend, database, and frontend services.

## Prerequisites

- Docker installed on your machine (2.10+ recommended).
- Docker Compose installed (v2.0+ recommended).
- Ensure port **5433** is available for the PostgreSQL container.

### Version Requirements

1. **Check Docker version:**
   ```sh
   docker --version
   # Should output something like: Docker version 24.0.7, build afdd53b
   ```
   If your version is below 20.10.0, please update Docker following the [official upgrade guide](https://docs.docker.com/engine/install/).

2. **Check Docker Compose version:**
   ```sh
   # For Docker Compose V2
   docker compose version
   # Should output something like: Docker Compose version v2.21.0
   ```

   If you get a "command not found" error, you might have the older version. Check with:
   ```sh
   docker compose version
   ```

### Installing/Updating Docker

1. **For Ubuntu/Debian:**
   ```sh
   # Remove old versions
   sudo apt-get remove docker docker-engine docker.io containerd runc

   # Install latest version
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

2. **For Windows/Mac:**
   - Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

3. **For other systems:**
   - Follow the [official Docker installation guide](https://docs.docker.com/engine/install/)

## Starting the Development Environment

1. **Clone the Repository**

   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Build and Start Services**

   To build and run the entire development environment, use the following command:

   ```sh
   docker compose -f devops/docker-compose.dev.yaml up --build
   ```

   For Windows users, use this command to build and start the development environment:

   ```sh
   docker compose -f devops/docker-compose.dev-windows.yaml up --build
   ```

   This command will:

   - Build the backend and frontend Docker images.
   - Start the backend, frontend, and PostgreSQL database containers.

3. **Access the Application**

   - **Backend API**: Accessible at [http://localhost:8000](http://localhost:8000).
   - **Frontend**: Accessible at [http://localhost:3000](http://localhost:3000).
   - **PostgreSQL Database**: Accessible at `localhost:5433` (make sure to use the `DB_USER` and `DB_PASSWORD` from the `.env.dev` file).

## Makefile Automation

To simplify repetitive tasks and ensure consistency, a `Makefile` is included in the project. Below are the tasks it supports:

| Command        | Description                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `make prod`    | Sets up and runs the **production environment**. Builds and starts the app using Docker.       |
| `make dev`     | Sets up and runs the **development environment**. Installs dependencies and starts the app.    |
| `make windows` | Sets up the project specifically for **Windows environments**. Handles Windows-specific tasks. |
| `make back`    | Starts the **backend services**. Useful for running or testing backend APIs.                   |

### How to Use the Makefile

1. **Run a Target**:

   ```sh
   make <target>
   ```

   Replace `<target>` with one of the commands listed above, such as `prod` or `dev`.

2. **Examples**:

   - To set up the production environment:
     ```sh
     make prod
     ```
   - To set up the development environment:
     ```sh
     make dev
     ```
   - For Windows-specific setup:
     ```sh
     make windows
     ```
   - To start backend services:
     ```sh
     make back
     ```

3. **Default Behavior**:
   If no target is provided, `make` will prompt you to specify one.

4. **Customizing the Makefile**:
   Feel free to edit the `Makefile` to add or adjust targets as per your project needs.

## Common Issues

- **Port Conflict**: Ensure port `5433` is free, as PostgreSQL will bind to this port in the development environment.
- **Docker Build Issues**: If changes in dependencies are not reflected, you may need to clear Docker's cache:

  ```sh
  docker compose -f devops/docker-compose.dev.yaml build --no-cache
  ```

  Windows users:

  ```sh
  docker compose -f devops/docker-compose.dev-windows.yaml build --no-cache
  ```

## How to run test cases

In root folder run next commands:

```bash
poetry install
```

Activate env

```bash
poetry shell
```

Run test cases

```bash
poetry run pytest
```

## Stopping the Development Environment

To stop the environment and remove containers, use:

```sh
docker compose -f devops/docker-compose.dev.yaml down
```

windows users:

```sh
docker compose -f devops/docker-compose.dev-windows.yaml down
```

This command stops all running containers and removes them, but the data volumes will persist.

## Rebuild or Update

If you have made changes to the code or Docker configuration, rebuild the containers:

```sh
docker compose -f devops/docker-compose.dev.yaml up --build
```

windows users:

```sh
docker compose -f devops/docker-compose.dev-windows.yaml up --build
```

## About Celery

This project utilizes Celery to handle asynchronous tasks. The Celery workers and scheduler are defined within the Docker Compose setup.

### Services Overview

- **Celery Worker**: Executes tasks in the background.
- **Celery Beat**: Schedules periodic tasks.
- **Redis**: Used as the message broker for Celery.

### Running Celery

To start the Celery worker and Celery Beat services, use the following command in the terminal within your project directory:

```bash
docker compose up -d celery celery_beat
```

### Stopping Celery

To stop the Celery worker and Beat services, run

```bash
docker compose stop celery celery_beat
```

### Purging Celery Tasks

If you want to purge all tasks from the Celery queue, you can do this by executing

```bash
docker compose run --rm celery celery -A spotnet_tracker.celery_config purge
```

## How to add test data

1. Run dev container

```
docker compose -f devops/docker-compose.dev.yaml up --build
```

windows only:

```
docker compose -f devops/docker-compose.dev-windows.yaml up --build
```

2. In new terminal window run command to populate db

```
docker exec -ti backend_dev python -m web_app.db.seed_data
```

## How to create migration file:

Run up docker containers

```bash
docker compose -f devops/docker-compose.dev.yaml up --build
```

Windows users:

```bash
docker compose -f devops/docker-compose.dev-windows.yaml up --build
```

Go to backend container in new terminal window

```bash
docker exec -ti backend_dev bash
```

Run command to create migration file

```bash
alembic -c web_app/alembic.ini revision --autogenerate -m "migration message"
```

## Pre-commit Setup

To ensure code quality, install pre-commit hooks locally:

1. Install pre-commit:
   ```bash
   pip3 install pre-commit
   ```
2. Install hooks:
   ```bash
   pre-commit install
   ```
