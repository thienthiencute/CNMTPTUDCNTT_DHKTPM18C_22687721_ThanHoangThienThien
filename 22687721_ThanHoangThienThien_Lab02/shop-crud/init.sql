CREATE DATABASE shopdb;
USE shopdb;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  password VARCHAR(100)
);

INSERT INTO users(username, password)
VALUES ('admin', '123');

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(10,2),
  quantity INT
);
INSERT INTO products (name, price, quantity) VALUES
('Laptop Dell Inspiron 15', 18500000, 12),
('Laptop HP Pavilion', 17200000, 8),
('MacBook Air M1', 24500000, 5),
('Chuột Logitech MX Master 3', 2350000, 25),
('Bàn phím cơ Keychron K6', 2190000, 18),
('Màn hình LG 24 inch', 3650000, 10),
('Tai nghe Sony WH-1000XM5', 7990000, 6),
('Ổ cứng SSD Samsung 1TB', 2890000, 20),
('USB Kingston 64GB', 250000, 50),
('Webcam Logitech C920', 1990000, 7);
