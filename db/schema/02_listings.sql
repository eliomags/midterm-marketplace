DROP TABLE IF EXISTS listings CASCADE;

CREATE TABLE listings (
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  photo_1 VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  list_date DATE NOT NULL,
  featured_status BOOLEAN NOT NULL DEFAULT FALSE,
  sold_status BOOLEAN NOT NULL DEFAULT FALSE
);
