DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL(3,2) NOT NULL,
stock_quantity INT NOT NULL
);

INSERT INTO users (product_name, department_name, price, stock_quantity)
VALUES ('Socks', 'Clothing', 5.00, 10), 
('Hat', 'Clothing', 20.00, 10), 
('Hose', 'Gardening', 10.00, 5),
('Rake', 'Gardening', 25.00, 5),
('Sofa', 'Furniture', 300.00, 4),
('Table', 'Furniture', 100.00, 4),
('Laptop', 'Electronics', 500.00, 8),
('Table', 'Electronics', 200.00, 8),
('Towels', 'Bath', 15.00, 20),
('Shampoo', 'Bath', 8.00, 20)
;


