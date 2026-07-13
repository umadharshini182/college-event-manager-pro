USE college_event_manager;

-- Table 1: Core System Identities (Authentication & Authorization)
CREATE TABLE IF NOT EXISTS system_users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 2: Event Entities Manifest
CREATE TABLE IF NOT EXISTS event_manifest (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    department VARCHAR(100) NOT NULL,
    event_date DATETIME NOT NULL,
    max_capacity INT NOT NULL,
    ticket_price DECIMAL(10, 2) DEFAULT 0.00
) ENGINE=InnoDB;

-- Table 3: Transactional Registrations Matrix
CREATE TABLE IF NOT EXISTS event_registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    payment_status ENUM('Pending', 'Paid', 'Refunded') DEFAULT 'Pending',
    attendance_status ENUM('Absent', 'Present') DEFAULT 'Absent',
    credential_hash VARCHAR(64) UNIQUE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES system_users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES event_manifest(event_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed Data: Insert a mock event so our UI has content instantly on Day 2
INSERT INTO event_manifest (title, description, department, event_date, max_capacity, ticket_price)
VALUES ('National Tech Hackathon 2026', '36-hour continuous build cycle targeting decentralized infrastructure applications.', 'Computer Science', '2026-10-15 09:00:00', 150, 0.00);