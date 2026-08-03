require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql2");

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

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

    } else {

        console.log("✅ MySQL Connected");
        console.log("HOST:", process.env.MYSQLHOST);
        console.log("DATABASE:", process.env.MYSQLDATABASE);

    }

});

        const createTable = `
        CREATE TABLE IF NOT EXISTS registrations (

            id INT AUTO_INCREMENT PRIMARY KEY,

            fullname VARCHAR(100) NOT NULL,

            email VARCHAR(100) NOT NULL,

            college VARCHAR(100) NOT NULL,

            department VARCHAR(100) NOT NULL,

            year VARCHAR(20) NOT NULL,

            event VARCHAR(100) NOT NULL,

            payment_status VARCHAR(20) DEFAULT 'Paid',

            amount INT DEFAULT 1000,

            attendance VARCHAR(20) DEFAULT 'Absent',

            certificate_generated BOOLEAN DEFAULT FALSE,

            certificate_date DATE,

            certificate_id VARCHAR(100),

            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );
        `;

        db.query(createTable, (err) => {

            if (err) {

                console.log(err);

            } else {

                console.log("✅ registrations table ready");

            }

        });

        const createEventsTable = `
        CREATE TABLE IF NOT EXISTS events (

            id INT AUTO_INCREMENT PRIMARY KEY,

            event_name VARCHAR(100) NOT NULL,

            event_date DATE NOT NULL,

            venue VARCHAR(150) NOT NULL,

            fee INT DEFAULT 0,

            status VARCHAR(30) DEFAULT 'Open',

            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );
        `;

        db.query(createEventsTable, (err) => {

            if (err) {

                console.log(err);

            } else {

                console.log("✅ events table ready");

            }

        });

    }

});

app.use(session({

    secret: "college_event_manager_secret",

    resave: false,

    saveUninitialized: false,

    cookie: {

        secure: false,

        sameSite: "lax"

    }

}));

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "index.html"));

});
// ===============================
// REGISTER
// ===============================

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
    INSERT INTO registrations
    (
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
        certificate_date,
        certificate_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            null,
            certificateId
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
                id: result.insertId,
                certificate_id: certificateId
            });

        }
    );

});


// ===============================
// ADMIN LOGIN
// ===============================

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

            role: "admin"

        });

    }

    res.json({

        success: false,

        message: "Invalid Email or Password"

    });

});


// ===============================
// CURRENT USER
// ===============================

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


// ===============================
// LOGOUT
// ===============================

app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({

            success: true

        });

    });

});
// ===============================
// DASHBOARD
// ===============================

app.get("/dashboard", (req, res) => {

    if (!req.session.user) {

        return res.redirect("/admin-login.html");

    }

    res.sendFile(path.join(__dirname, "admin.html"));

});


// ===============================
// GET ALL STUDENTS
// ===============================

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


// ===============================
// ADMIN DATA
// ===============================

app.get("/admin", (req, res) => {

    if (!req.session.user || req.session.user.role !== "admin") {

        return res.status(403).json({

            success: false,

            message: "Access Denied"

        });

    }

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


// ===============================
// DELETE STUDENT
// ===============================

app.delete("/student/:id", (req, res) => {

    const sql = `
    DELETE FROM registrations
    WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err) => {

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


// ===============================
// CLEAR ALL STUDENTS
// ===============================

app.delete("/clear", (req, res) => {

    if (!req.session.user || req.session.user.role !== "admin") {

        return res.status(403).json({

            success: false

        });

    }

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
// ===============================
// MARK ATTENDANCE + GENERATE CERTIFICATE
// ===============================

app.put("/attendance/:id", (req, res) => {

    const certificateId =
        "CEM-" +
        new Date().getFullYear() +
        "-" +
        Date.now();

    const sql = `
    UPDATE registrations
    SET
        attendance = 'Present',
        certificate_generated = TRUE,
        certificate_date = CURDATE(),
        certificate_id = ?
    WHERE id = ?
    `;

    db.query(sql, [certificateId, req.params.id], (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Attendance update failed"
            });

        }

        res.json({
            success: true,
            certificate_id: certificateId
        });

    });

});


// ===============================
// VIEW CERTIFICATE
// ===============================

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

        if (student.attendance !== "Present") {

            return res.json({
                success: false,
                message: "You were marked Absent for this event. Certificate is not available."
            });

        }

        if (!student.certificate_generated) {

            return res.json({
                success: false,
                message: "Certificate has not been generated by the administrator yet."
            });

        }

        res.json({
            success: true,
            student
        });

    });

})
// ===============================
// GENERATE CERTIFICATE
// ===============================

app.put("/certificate/:id", (req, res) => {

    const certificateId =
        "CEM-" +
        new Date().getFullYear() +
        "-" +
        Date.now();

    const sql = `
    UPDATE registrations
    SET
        certificate_generated = TRUE,
        certificate_date = CURDATE(),
        certificate_id = ?
    WHERE id = ?
    `;

    db.query(sql, [certificateId, req.params.id], (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false,
                message: "Certificate generation failed."
            });

        }

        res.json({
            success: true,
            certificate_id: certificateId
        });

    });

});
// ===============================
// GET ALL EVENTS
// ===============================

app.get("/events", (req, res) => {

    const sql = `
    SELECT *
    FROM events
    ORDER BY event_date ASC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json([]);

        }

        res.json(results);

    });

});


// ===============================
// ADD EVENT
// ===============================

app.post("/events", (req, res) => {

    const {
        event_name,
        event_date,
        venue,
        fee,
        status
    } = req.body;

    const sql = `
    INSERT INTO events
    (
        event_name,
        event_date,
        venue,
        fee,
        status
    )
    VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
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


// ===============================
// UPDATE EVENT
// ===============================

app.put("/events/:id", (req, res) => {

    const {
        event_name,
        event_date,
        venue,
        fee,
        status
    } = req.body;

    const sql = `
    UPDATE events
    SET
        event_name=?,
        event_date=?,
        venue=?,
        fee=?,
        status=?
    WHERE id=?
    `;

    db.query(
        sql,
        [
            event_name,
            event_date,
            venue,
            fee,
            status,
            req.params.id
        ],
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


// ===============================
// DELETE EVENT
// ===============================

app.delete("/events/:id", (req, res) => {

    const sql = `
    DELETE FROM events
    WHERE id=?
    `;

    db.query(sql, [req.params.id], (err) => {

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
// ===============================
// ADMIN PAGES
// ===============================

app.get("/admin.html", (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/students.html", (req, res) => {
    res.sendFile(path.join(__dirname, "students-admin.html"));
});

app.get("/events.html", (req, res) => {
    res.sendFile(path.join(__dirname, "events-admin.html"));
});

app.get("/payments.html", (req, res) => {
    res.sendFile(path.join(__dirname, "payments-admin.html"));
});

app.get("/certificates.html", (req, res) => {
    res.sendFile(path.join(__dirname, "certificates-admin.html"));
});

app.get("/settings.html", (req, res) => {
    res.sendFile(path.join(__dirname, "settings-admin.html"));
});


// ===============================
// SERVER START
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("====================================");
    console.log("🚀 College Event Manager Started");
    console.log("🌐 Server running on Port:", PORT);
    console.log("====================================");

});