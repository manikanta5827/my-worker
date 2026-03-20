






INSERT INTO users (name, email, created_at, updated_at) VALUES
  ('Ravi Kumar',   'ravi@example.com',  datetime('now'), datetime('now')),
  ('Priya Sharma', 'priya@example.com', datetime('now'), datetime('now'));

INSERT INTO posts (user_id, title, body, published, created_at) VALUES
  (1, 'First Post',  'Hello from Ravi',  1, datetime('now')),
  (1, 'Draft Post',  'Work in progress', 0, datetime('now')),
  (2, 'Priyas Post', 'Hello from Priya', 1, datetime('now'));