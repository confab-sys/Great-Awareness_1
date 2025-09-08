-- SQL script to add Test Product to the books table

INSERT INTO books (id, title, author, description, price, file_path, cover_path, created_at, updated_at)
VALUES (
  'Test Product',
  'Test Product',
  'Great Awareness',
  'This is a test product for payment system testing.',
  1,
  'test product.pdf',
  NULL,
  NOW(),
  NOW()
);