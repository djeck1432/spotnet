-- Initialize PostgreSQL with the correct user and database if they don't already exist

-- Create role if it does not exist
DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles
        WHERE rolname = 'postgres') THEN
        CREATE ROLE postgres WITH SUPERUSER CREATEDB CREATEROLE LOGIN PASSWORD 'password';
    END IF;
END
$$;

-- Create database if it does not exist
DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_database
        WHERE datname = 'spotnet') THEN
        CREATE DATABASE spotnet WITH OWNER = postgres;
    END IF;
END
$$;
