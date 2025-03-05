-- Create the data_items table
CREATE TABLE IF NOT EXISTS data_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO
    data_items (name, description)
VALUES
    ('Item 1', 'This is the first item description'),
    ('Item 2', 'This is the second item description'),
    ('Item 3', 'This is the third item description'),
    ('Item 4', 'This is the fourth item description'),
    ('Item 5', 'This is the fifth item description');

-- This file is for reference only
-- The actual database structure is likely already set up on your hosted PostgreSQL service
-- This represents your existing "Collectives" table structure
-- Uncomment and modify if you need to create this table locally
/*
CREATE TABLE IF NOT EXISTS "Collectives" (
id SERIAL PRIMARY KEY,
slug VARCHAR(255) NOT NULL,
-- Add other fields from your actual database as needed
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for local testing only
INSERT INTO
"Collectives" (slug)
VALUES
('collective1'),
('collective2'),
('collective3'),
('collective4'),
('collective5');
*/