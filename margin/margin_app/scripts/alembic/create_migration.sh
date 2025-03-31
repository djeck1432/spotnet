#!/bin/bash

read -p "Enter name of migration: " message
docker compose exec backend alembic revision --autogenerate -m "$message"
