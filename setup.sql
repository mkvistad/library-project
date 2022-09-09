DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(1000) NOT NULL,
  authors VARCHAR(1000),
  publishedDate TEXT,
  pageCount INT, 
  categories VARCHAR(500),
  maturityRating TEXT,
  imageLinks TEXT, 
  language TEXT,
  description TEXT,
  infoLink TEXT
);

-- CREATE TABLE isbn (
--   id SERIAL PRIMARY KEY,
--   isbn INT REFERENCES book(id) NOT NULL
-- );

-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     first_name VARCHAR(255) NOT NULL,
--     last_name VARCHAR(255) NOT NULL,
--     email VARCHAR(50) NOT NULL UNIQUE,
--     profile_pic_url TEXT,
--     password_hash VARCHAR NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     bio TEXT
-- );

-- CREATE TABLE reset_userinput(
--     id SERIAL PRIMARY KEY,
--     email VARCHAR NOT NULL,
--     code VARCHAR NOT NULL,
--     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE friendships(
--   id SERIAL PRIMARY KEY,
--   sender_id INT REFERENCES users(id) NOT NULL,
--   recipient_id INT REFERENCES users(id) NOT NULL,
--   accepted BOOLEAN DEFAULT false
-- );

-- CREATE TABLE chat_messages(
--   id SERIAL PRIMARY KEY,
--   sender_id INT REFERENCES users(id) NOT NULL,
--   message TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- psql -d library -f setup.sql

