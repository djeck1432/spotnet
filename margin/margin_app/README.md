# Spotnet2.0 Project

## Steps, to run API at localhost

### 1. Clone this repository

```bash
git clone https://github.com/djeck1432/spotnet
```

### 2. Set environment variables:

Rename ```example.env``` to ```.env``` with this command: ```mv .env.example .env``` and put your variables here

### 3. Start project with [docker compose](https://docs.docker.com/compose/)

1) [Install Docker](https://docs.docker.com/engine/install/) (if not already installed)
2) Start Docker
3) Run project
   
```bash
docker compose up
```

#### Also you need to create database and tables. You have 2 variants:
**Note: When you start the project with docker compose up, Docker automatically executes the Alembic migration.**

1) Use alembic

**Note: While this app is in beta, you first need to navigate to the `margin_app` folder.**
```bash
cd margin_app
```

And then:
```bash
alembic upgrade head
```

2) Any other script you have

#### To create a new migration:  
1) Ensure Docker Compose is running.  
2) Run the following script to create the migration:  
```bash
./scripts/alembic/create_migration.sh
```  
3) Choose a name for the migration.

### 4. Link to API

You need to use [this link](http://127.0.0.1:8000), for access to API.

### 5. Seed data generator
To generate test data, run the following command:
```bash
docker compose -f margin_app/docker-compose.yml exec backend python app/db/seed_data.py
```

Good luck! 😁
