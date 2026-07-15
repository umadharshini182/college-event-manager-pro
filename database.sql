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
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    venue VARCHAR(150) NOT NULL,
    fee INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'Open',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO events
(event_name, event_date, venue, fee, status)
VALUES
(
'Hackathon',
'2027-08-17',
'Main Auditorium',
1000,
'Open'
),
(
'AI Workshop',
'2027-08-18',
'Seminar Hall',
800,
'Open'
),
(
'Ideathon',
'2027-08-20',
'Innovation Lab',
500,
'Open'
),
(
'symposium',
'2027-08-22',
'Conference Hall',
600,
'Open'
);