-- Create database 
Create DATABASE LBPS;
USE LBPS;

-- Students  (with password field and resetToken)
CREATE TABLE Students (
    studentID VARCHAR(10) PRIMARY KEY,
    studentName VARCHAR(100) NOT NULL,
    diploma VARCHAR(100) NOT NULL,
    yearOfEntry INT NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Plaintext password for now (Will be hashed later)
    points INT DEFAULT 0 CHECK (points >= 0 AND points <= 9999),
    resetToken VARCHAR(255) NULL, -- Token for password reset
    resetTokenExpiry BIGINT NULL  -- Expiry timestamp for reset token
);

-- Admin  (with password field and resetToken)
CREATE TABLE Admins (
    adminID INT AUTO_INCREMENT PRIMARY KEY,
    adminName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Plaintext password for now (Will be hashed later)
    resetToken VARCHAR(255) NULL, -- Token for password reset
    resetTokenExpiry BIGINT NULL  -- Expiry timestamp for reset token
);

--  Redeemable Items table
CREATE TABLE RedeemableItems (
    itemID INT AUTO_INCREMENT PRIMARY KEY,
    itemName VARCHAR(100) NOT NULL,
    pointsRequired INT NOT NULL CHECK (pointsRequired > 0),
    quantity INT NOT NULL CHECK (quantity >= 0)
);

-- Redeemed Items table
CREATE TABLE RedeemedItems (
    redeemID INT AUTO_INCREMENT PRIMARY KEY,
    studentID VARCHAR(10),
    itemID INT,
    redeemDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentID) REFERENCES Students(studentID) ON DELETE CASCADE,
    FOREIGN KEY (itemID) REFERENCES RedeemableItems(itemID) ON DELETE CASCADE
);

-- Dummy Data into Students table
INSERT INTO Students (studentID, studentName, diploma, yearOfEntry, email, password, points) VALUES
('A1234567X', 'John Tan', 'Diploma in IT', 2024, 'john.tan.2024@example.edu', 'password123', 50),
('A1234568Y', 'Sarah Lim', 'Diploma in Business', 2023, 'sarah.lim.2024@example.edu', 'securepass456', 80);

--  Dummy Data into Admin table
INSERT INTO Admins (adminName, email, password) VALUES
('Library Admin', 'admin@example.com', 'adminpass123'),
('Super Admin', 'superadmin@example.com', 'supersecure456');

--  Dummy Data into Redeemable Items table
INSERT INTO RedeemableItems (itemName, pointsRequired, quantity) VALUES
('Notebook', 100, 10),
('Pen', 50, 20),
('USB Drive', 250, 5),
('T-Shirt', 300, 15),
('Water Bottle', 200, 10);

-- Dummy Data into Redeemed Items table (Example redemptions)
INSERT INTO RedeemedItems (studentID, itemID) VALUES
('A1234567X', 1), -- John Tan redeemed a Notebook
('A1234568Y', 2); -- Sarah Lim redeemed a Pen
