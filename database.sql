CREATE DATABASE IF NOT EXISTS college_event_manager;
USE college_event_manager;

DROP TABLE IF EXISTS registrations;

CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    college VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year VARCHAR(50) NOT NULL,
    event VARCHAR(100) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Paid',
    amount INT DEFAULT 1000,
    attendance VARCHAR(20) DEFAULT 'Absent',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO registrations
(fullname, email, college, department, year, event, payment_status, amount, attendance)
VALUES 
(
'Demo Student',
'demo@gmail.com',
'ABC Engineering College',
'CSE',
'2nd Year',
'Hackathon',
'Paid',
1000,
'Absent'
);