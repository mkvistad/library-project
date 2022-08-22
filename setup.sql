DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    profile_pic_url TEXT,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reset_userinput(
    id SERIAL PRIMARY KEY
    email VARCHAR NOT NULL
    code VARCHAR NOT NULL
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- psql -d social-network -f setup.sql

