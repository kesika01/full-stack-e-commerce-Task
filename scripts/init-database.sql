-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carts table
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Items table (junction table)
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id),
    item_id INTEGER REFERENCES items(id),
    quantity INTEGER DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    cart_id INTEGER REFERENCES carts(id),
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    item_id INTEGER REFERENCES items(id),
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10, 2)
);

-- Insert sample data
INSERT INTO items (name, description, price) VALUES
('Laptop', 'High-performance laptop for work and gaming', 999.99),
('Smartphone', 'Latest smartphone with advanced features', 699.99),
('Headphones', 'Wireless noise-cancelling headphones', 199.99),
('Tablet', 'Lightweight tablet for productivity', 399.99),
('Smart Watch', 'Fitness tracking smartwatch', 299.99),
('Camera', 'Professional DSLR camera', 1299.99);

-- Insert demo users
INSERT INTO users (username, password) VALUES
('demo', 'password'),
('user1', 'pass123');
