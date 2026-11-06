CREATE DATABASE IF NOT EXISTS parking_lot_db;
USE parking_lot_db;

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone_no VARCHAR(15) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  role ENUM('Admin','Security Staff','User') NOT NULL
);

CREATE TABLE IF NOT EXISTS parking_slots (
  slot_id INT AUTO_INCREMENT PRIMARY KEY,
  slot_number VARCHAR(20) NOT NULL UNIQUE,
  vehicle_type ENUM('Two Wheeler','Four Wheeler') NOT NULL,
  location VARCHAR(100) NOT NULL,
  status ENUM('Available','Occupied') DEFAULT 'Available'
);

CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  vehicle_number VARCHAR(20) NOT NULL UNIQUE,
  vehicle_type ENUM('Two Wheeler','Four Wheeler') NOT NULL,
  vehicle_model VARCHAR(80) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS parking_records (
  record_id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id INT NOT NULL,
  slot_id INT NOT NULL,
  entry_time DATETIME NOT NULL,
  exit_time DATETIME NULL,
  parking_fee DECIMAL(10,2) DEFAULT 0,
  status ENUM('Active','Completed') DEFAULT 'Active',
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
  FOREIGN KEY (slot_id) REFERENCES parking_slots(slot_id)
);

-- Optional sample data (insert users and slots before vehicles/records)
INSERT IGNORE INTO users (user_id,name,phone_no,email,role) VALUES
(1,'Ravi Kumar','9876543210','ravi@example.com','Security Staff'),
(2,'Teja','9123456780','teja@example.com','User');

INSERT IGNORE INTO parking_slots (slot_id,slot_number,vehicle_type,location,status) VALUES
(1,'A-01','Two Wheeler','Ground Floor','Available'),
(2,'B-01','Four Wheeler','Ground Floor','Available');

INSERT IGNORE INTO vehicles (vehicle_id,user_id,vehicle_number,vehicle_type,vehicle_model) VALUES
(1,2,'AP 21 AB 1234','Two Wheeler','Honda Activa');
