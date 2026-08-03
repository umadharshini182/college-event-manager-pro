require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.use(session({
    secret: "college_event_manager_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: "lax"
    }
}));

const db = mysql.createConnection({

    host: process.env.MYSQLHOST,

    user: process.env.MYSQLUSER,

    password: process.env.MYSQLPASSWORD,

    database: process.env.MYSQLDATABASE,

    port: process.env.MYSQLPORT

});

db.connect((err) => {

    if (err) {

        console.log("❌ MySQL Connection Failed");
        console.log(err);
        return;

    }

    console.log("✅ MySQL Connected");

    createTables();
    updateDatabase();

});
function createTables() {

    const registrationTable = `

    CREATE TABLE IF NOT EXISTS registrations(

        id INT AUTO_INCREMENT PRIMARY KEY,

        fullname VARCHAR(100),

        email VARCHAR(100),

        college VARCHAR(150),

        department VARCHAR(100),

        year VARCHAR(20),

        event VARCHAR(100),

        payment_status VARCHAR(30) DEFAULT 'Paid',

        amount INT DEFAULT 1000,

        attendance VARCHAR(20) DEFAULT 'Absent',

        certificate_generated BOOLEAN DEFAULT FALSE,

        certificate_id VARCHAR(100),

        certificate_date DATE,

        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    )

    `;

    db.query(registrationTable, (err) => {

        if (err) {

            console.log(err);

        } else {

            console.log("✅ registrations table ready");

        }

    });

    const eventsTable = `

    CREATE TABLE IF NOT EXISTS events(

        id INT AUTO_INCREMENT PRIMARY KEY,

        event_name VARCHAR(100),

        event_date DATE,

        venue VARCHAR(100),

        fee INT,

        status VARCHAR(30),

        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    )

    `;

    db.query(eventsTable, (err) => {

        if (err) {

            console.log(err);

        } else {

            console.log("✅ events table ready");

        }

    });

}
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "index.html"));

});
// ======================================
// STUDENT REGISTRATION
// ======================================

app.post("/register", (req, res) => {

    const {

        fullname,
        email,
        college,
        department,
        year,
        event

    } = req.body;

    const certificateId =
        "CEM-" +
        new Date().getFullYear() +
        "-" +
        Date.now();

    const sql = `

    INSERT INTO registrations(

        fullname,
        email,
        college,
        department,
        year,
        event,
        payment_status,
        amount,
        attendance,
        certificate_generated,
        certificate_id,
        certificate_date

    )

    VALUES(?,?,?,?,?,?,?,?,?,?,?,?)

    `;

    db.query(

        sql,

        [

            fullname,
            email,
            college,
            department,
            year,
            event,
            "Paid",
            1000,
            "Absent",
            false,
            certificateId,
            null

        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    success: false,

                    message: "Registration Failed"

                });

            }

            res.json({

                success: true,

                message: "Registration Successful",

                id: result.insertId

            });

        }

    );

});
// ======================================
// GET ALL STUDENTS
// ======================================

app.get("/students", (req, res) => {

    const sql = `

    SELECT *

    FROM registrations

    ORDER BY id DESC

    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json([]);

        }

        res.json(results);

    });

});
// ======================================
// ADMIN LOGIN
// ======================================

app.post("/auth/login", (req, res) => {

    const { email, password } = req.body;

    if (
        email === "admin@gmail.com" &&
        password === "admin123"
    ) {

        req.session.user = {
            email,
            role: "admin"
        };

        return res.json({
            success: true,
            message: "Login Successful"
        });

    }

    res.json({
        success: false,
        message: "Invalid Email or Password"
    });

});
// ======================================
// CURRENT USER
// ======================================

app.get("/api/current-user", (req, res) => {

    if (!req.session.user) {

        return res.json({
            loggedIn: false
        });

    }

    res.json({
        loggedIn: true,
        user: req.session.user
    });

});
// ======================================
// LOGOUT
// ======================================

app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({
            success: true
        });

    });

});
// ======================================
// ADMIN DASHBOARD
// ======================================

app.get("/admin", (req, res) => {

    if (!req.session.user) {

        return res.status(403).json({
            success: false,
            message: "Please login first"
        });

    }

    db.query(
        "SELECT * FROM registrations ORDER BY id DESC",
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json([]);

            }

            res.json(results);

        }

    );

});
// ======================================
// MARK ATTENDANCE
// ======================================

app.put("/attendance/:id", (req, res) => {

    const sql = `
    UPDATE registrations
    SET attendance = 'Present'
    WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Attendance Update Failed"
            });

        }

        res.json({
            success: true,
            message: "Attendance Updated"
        });

    });

});
// ======================================
// GENERATE CERTIFICATE
// ======================================

app.put("/certificate/:id", (req, res) => {

    const getStudent = `
    SELECT event, attendance
    FROM registrations
    WHERE id = ?
    `;

    db.query(getStudent, [req.params.id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        if (result.length === 0) {

            return res.json({
                success: false,
                message: "Student Not Found"
            });

        }

        if (result[0].attendance !== "Present") {

            return res.json({
                success: false,
                message: "Mark attendance first."
            });

        }

        const certificateId =
            "CEM-" +
            new Date().getFullYear() +
            "-" +
            Date.now();

        const sql = `
        UPDATE registrations
        SET
            certificate_generated = TRUE,
            certificate_id = ?,
            certificate_date = CURDATE()
        WHERE id = ?
        `;

        db.query(sql, [certificateId, req.params.id], (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Certificate Generation Failed"
                });

            }

            res.json({
                success: true,
                certificateId
            });

        });

    });

});
// ======================================
// DELETE STUDENT
// ======================================

app.delete("/student/:id", (req, res) => {

    db.query(
        "DELETE FROM registrations WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false
                });

            }

            res.json({
                success: true
            });

        }
    );

});
// ======================================
// VIEW CERTIFICATE
// ======================================

app.get("/certificate/:email", (req, res) => {

    const sql = `
    SELECT *
    FROM registrations
    WHERE email = ?
    ORDER BY id DESC
    LIMIT 1
    `;

    db.query(sql, [req.params.email], (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });

        }

        if (results.length === 0) {

            return res.json({
                success: false,
                message: "Student not found."
            });

        }

        const student = results[0];

        // Student must be present
        if (student.attendance !== "Present") {

            return res.json({
                success: false,
                message: "You were absent for this event."
            });

        }

        // Certificate must be generated
        if (student.certificate_generated != 1) {

            return res.json({
                success: false,
                message: "Certificate has not been generated by the administrator yet."
            });

        }

        res.json({

            success: true,

            student: {

                fullname: student.fullname,

                email: student.email,

                event: student.event,

                certificate_id: student.certificate_id,

                certificate_date: student.certificate_date

            }

        });

    });

});
// ======================================
// CLEAR ALL STUDENTS
// ======================================

app.delete("/clear", (req, res) => {

    db.query("DELETE FROM registrations", (err) => {

        if (err) {

            console.log(err);

            return res.json({
                success: false
            });

        }

        res.json({
            success: true
        });

    });

});
// ======================================
// GET EVENTS
// ======================================

app.get("/events", (req, res) => {

    db.query(

        "SELECT * FROM events ORDER BY event_date ASC",

        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json([]);

            }

            res.json(results);

        }

    );

});


// ======================================
// ADD EVENT
// ======================================

app.post("/events", (req, res) => {

    const {

        event_name,
        event_date,
        venue,
        fee,
        status

    } = req.body;

    db.query(

        `INSERT INTO events
        (event_name,event_date,venue,fee,status)
        VALUES(?,?,?,?,?)`,

        [

            event_name,
            event_date,
            venue,
            fee,
            status

        ],

        (err, result) => {

            if (err) {

                console.log(err);

                return res.json({
                    success: false
                });

            }

            res.json({
                success: true,
                id: result.insertId
            });

        }

    );

});


// ======================================
// DELETE EVENT
// ======================================

app.delete("/events/:id", (req, res) => {

    db.query(

        "DELETE FROM events WHERE id=?",

        [req.params.id],

        (err) => {

            if (err) {

                console.log(err);

                return res.json({
                    success: false
                });

            }

            res.json({
                success: true
            });

        }

    );

});
// ======================================
// SERVER START
// ======================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("======================================");
    console.log("🚀 College Event Manager Started");
    console.log("🌐 Running on Port:", PORT);
    console.log("======================================");

});