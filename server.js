require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcryptjs");

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
const db = mysql.createPool({

    host: process.env.MYSQLHOST,

    user: process.env.MYSQLUSER,

    password: process.env.MYSQLPASSWORD,

    database: process.env.MYSQLDATABASE,

    port: Number(process.env.MYSQLPORT),

    ssl: {
        rejectUnauthorized: false
    },

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0,

    connectTimeout: 20000
});

// ======================================
// CREATE DATABASE TABLES
// ======================================

function createTables(callback) {

    const registrationsTable = `

        CREATE TABLE IF NOT EXISTS registrations (

            id INT AUTO_INCREMENT PRIMARY KEY,

            fullname VARCHAR(100) NOT NULL,

            email VARCHAR(150) NOT NULL,

            college VARCHAR(150) NOT NULL,

            department VARCHAR(100) NOT NULL,

            year VARCHAR(50) NOT NULL,

            event VARCHAR(150) NOT NULL,

            payment_status VARCHAR(30) DEFAULT 'Paid',

            amount INT DEFAULT 1000,

            payment_method VARCHAR(50),

            transaction_id VARCHAR(100),

            payment_date DATETIME,

            attendance VARCHAR(20) DEFAULT 'Absent',

            certificate_generated BOOLEAN DEFAULT FALSE,

            certificate_id VARCHAR(100),

            certificate_date DATE,

            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )

    `;


    const eventsTable = `

        CREATE TABLE IF NOT EXISTS events (

            id INT AUTO_INCREMENT PRIMARY KEY,

            event_name VARCHAR(150) NOT NULL,

            event_date DATE NOT NULL,

            venue VARCHAR(150),

            fee INT DEFAULT 0,

            status VARCHAR(50) DEFAULT 'Upcoming',

            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )

    `;


    db.query(
        registrationsTable,
        (err) => {

            if (err) {

                console.error(
                    "❌ Registrations table error:",
                    err
                );

                return;

            }


            console.log(
                "✅ Registrations table ready"
            );


            db.query(
                eventsTable,
                (eventErr) => {

                    if (eventErr) {

                        console.error(
                            "❌ Events table error:",
                            eventErr
                        );

                        return;

                    }


                    console.log(
                        "✅ Events table ready"
                    );


                    if (callback) {

                        callback();

                    }

                }
            );

        }
    );

}


// ======================================
// ENSURE PAYMENT COLUMNS EXIST
// ======================================

function ensurePaymentColumns() {

    const columns = [

        {
            name: "payment_method",

            sql: `
                ALTER TABLE registrations
                ADD COLUMN payment_method VARCHAR(50)
            `
        },

        {
            name: "transaction_id",

            sql: `
                ALTER TABLE registrations
                ADD COLUMN transaction_id VARCHAR(100)
            `
        },

        {
            name: "payment_date",

            sql: `
                ALTER TABLE registrations
                ADD COLUMN payment_date DATETIME
            `
        }

    ];


    function addColumn(index) {

        if (
            index >=
            columns.length
        ) {

            console.log(
                "✅ Payment columns checked"
            );

            return;

        }


        const column =
            columns[index];


        db.query(
            column.sql,
            (err) => {

                if (err) {

                    const message =
                        String(
                            err.message
                        ).toLowerCase();


                    if (
                        message.includes(
                            "duplicate column"
                        )
                    ) {

                        console.log(
                            `✓ ${column.name} already exists`
                        );

                    } else {

                        console.log(
                            `ℹ️ ${column.name}:`,
                            err.message
                        );

                    }

                } else {

                    console.log(
                        `✅ Added ${column.name}`
                    );

                }


                addColumn(
                    index + 1
                );

            }
        );

    }


    addColumn(0);

}


// ======================================
// INITIALIZE DATABASE
// ======================================

createTables(
    () => {

        ensurePaymentColumns();

    }
);
// ======================================
// ADMIN CREDENTIALS
// ======================================

function ensureAdminCredentials() {

    const createAdminTable = `

        CREATE TABLE IF NOT EXISTS admin_credentials (

            id INT AUTO_INCREMENT PRIMARY KEY,

            email VARCHAR(150) NOT NULL UNIQUE,

            password_hash VARCHAR(255) NOT NULL,

            updated_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP

        )

    `;


    db.query(
        createAdminTable,
        async (err) => {

            if (err) {

                console.error(
                    "❌ Admin table error:",
                    err
                );

                return;

            }


            console.log(
                "✅ Admin credentials table ready"
            );


            db.query(
                "SELECT * FROM admin_credentials LIMIT 1",
                async (selectErr, results) => {

                    if (selectErr) {

                        console.error(
                            "❌ Admin credentials check failed:",
                            selectErr
                        );

                        return;

                    }


                    // Create the first admin account
                    // only if one doesn't exist.

                    if (results.length === 0) {

                        const passwordHash =
                            await bcrypt.hash(
                                "admin123",
                                10
                            );


                        db.query(
                            `
                            INSERT INTO admin_credentials
                            (email, password_hash)
                            VALUES (?, ?)
                            `,
                            [
                                "admin@gmail.com",
                                passwordHash
                            ],
                            (insertErr) => {

                                if (insertErr) {

                                    console.error(
                                        "❌ Admin account creation failed:",
                                        insertErr
                                    );

                                    return;

                                }


                                console.log(
                                    "✅ Default admin account created"
                                );

                            }
                        );

                    }

                    else {

                        console.log(
                            "✅ Admin account already exists"
                        );

                    }

                }
            );

        }
    );

}


ensureAdminCredentials();
// ======================================
// STUDENT REGISTRATION + PAYMENT
// ======================================

app.post("/register", (req, res) => {

    const {
        fullname,
        email,
        college,
        department,
        year,
        event,

        paymentMethod,
        paymentStatus,
        paymentAmount,
        paymentDate,
        paymentId

    } = req.body;


    // --------------------------------------
    // BASIC VALIDATION
    // --------------------------------------

    if (
        !fullname ||
        !email ||
        !college ||
        !department ||
        !year ||
        !event
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Please provide all student details."

        });

    }


    // --------------------------------------
    // CERTIFICATE ID
    // --------------------------------------

    const certificateId =
        "CEM-" +
        new Date().getFullYear() +
        "-" +
        String(
            Math.floor(
                Math.random() * 999999
            )
        ).padStart(6, "0");


    // --------------------------------------
    // PAYMENT VALUES
    // --------------------------------------

    const finalPaymentMethod =
        paymentMethod ||
        "Online Payment";


    const finalPaymentStatus =
        paymentStatus ||
        "Paid";


    const finalAmount =
        Number(paymentAmount) || 1000;


    const finalPaymentId =
        paymentId ||
        (
            "CEMTXN" +
            Date.now()
        );


    const finalPaymentDate =
        paymentDate
            ? new Date(paymentDate)
            : new Date();


    // --------------------------------------
    // INSERT
    // --------------------------------------

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
            payment_method,
            transaction_id,
            payment_date,

            attendance,
            certificate_generated,
            certificate_id,
            certificate_date

        )

        VALUES(
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )

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

            finalPaymentStatus,
            finalAmount,
            finalPaymentMethod,
            finalPaymentId,
            finalPaymentDate,

            "Absent",
            false,
            certificateId,
            null

        ],

        (err, result) => {

            if (err) {

                console.error(
                    "❌ Registration database error:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Registration Failed",

                    error:
                        err.message

                });

            }


            // --------------------------------------
            // SUCCESS
            // --------------------------------------

            console.log(
                "✅ Registration + payment saved:",
                result.insertId
            );


            res.json({

                success: true,

                message:
                    "Registration Successful",

                id:
                    result.insertId,

                registrationId:
                    result.insertId,

                paymentId:
                    finalPaymentId,

                paymentStatus:
                    finalPaymentStatus,

                paymentMethod:
                    finalPaymentMethod,

                amount:
                    finalAmount

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
// VERIFY REGISTRATION
// ======================================

app.get("/api/verify-registration", (req, res) => {

    const registrationId = req.query.id;

    if (!registrationId) {

        return res.status(400).json({
            success: false,
            message: "Registration ID is required."
        });

    }

    const sql = `
        SELECT
            id,
            fullname,
            email,
            college,
            department,
            year,
            event,
            payment_status
        FROM registrations
        WHERE id = ?
        LIMIT 1
    `;

    db.query(
        sql,
        [registrationId],
        (err, results) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    success: false,
                    message: "Database verification failed."
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Registration not found."
                });

            }

            const student = results[0];

            res.json({

                success: true,

                registration: {

                    id: student.id,

                    fullname: student.fullname,

                    email: student.email,

                    college: student.college,

                    department: student.department,

                    year: student.year,

                    event: student.event,

                    payment_status:
                        student.payment_status

                }

            });

        }
    );

});
// ======================================
// ADMIN LOGIN
// ======================================

app.post("/auth/login", (req, res) => {

    const { email, password } = req.body;


    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });

    }


    const sql = `
        SELECT *
        FROM admin_credentials
        WHERE email = ?
        LIMIT 1
    `;


    db.query(
        sql,
        [email],
        async (err, results) => {

            if (err) {

                console.error(
                    "❌ Admin login database error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Login server error."
                });

            }


            if (results.length === 0) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid Email or Password"
                });

            }


            const admin =
                results[0];


            const passwordMatch =
                await bcrypt.compare(
                    password,
                    admin.password_hash
                );


            if (!passwordMatch) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid Email or Password"
                });

            }


            req.session.user = {

                email: admin.email,

                role: "admin"

            };


            return res.json({

                success: true,

                message:
                    "Login Successful"

            });

        }
    );

});
// ======================================
// CHANGE ADMIN PASSWORD
// ======================================

app.post(
    "/api/change-password",
    async (req, res) => {

        try {

            // --------------------------------
            // CHECK LOGIN
            // --------------------------------

            if (!req.session.user) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Please login first."

                });

            }


            const {
                currentPassword,
                newPassword,
                confirmPassword
            } = req.body;


            // --------------------------------
            // VALIDATION
            // --------------------------------

            if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please fill all password fields."

                });

            }


            if (
                newPassword !==
                confirmPassword
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "New passwords do not match."

                });

            }


            if (
                newPassword.length < 6
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "New password must contain at least 6 characters."

                });

            }


            // --------------------------------
            // GET CURRENT ADMIN
            // --------------------------------

            const sql = `
                SELECT *
                FROM admin_credentials
                WHERE email = ?
                LIMIT 1
            `;


            db.query(
                sql,
                [req.session.user.email],
                async (
                    err,
                    results
                ) => {

                    if (err) {

                        console.error(
                            "❌ Password lookup error:",
                            err
                        );

                        return res.status(500).json({

                            success: false,

                            message:
                                "Database error."

                        });

                    }


                    if (
                        results.length === 0
                    ) {

                        return res.status(404).json({

                            success: false,

                            message:
                                "Admin account not found."

                        });

                    }


                    const admin =
                        results[0];


                    // --------------------------------
                    // VERIFY OLD PASSWORD
                    // --------------------------------

                    const currentPasswordCorrect =
                        await bcrypt.compare(
                            currentPassword,
                            admin.password_hash
                        );


                    if (
                        !currentPasswordCorrect
                    ) {

                        return res.status(401).json({

                            success: false,

                            message:
                                "Current password is incorrect."

                        });

                    }


                    // --------------------------------
                    // HASH NEW PASSWORD
                    // --------------------------------

                    const newPasswordHash =
                        await bcrypt.hash(
                            newPassword,
                            10
                        );


                    // --------------------------------
                    // UPDATE PASSWORD
                    // --------------------------------

                    const updateSql = `

                        UPDATE admin_credentials

                        SET password_hash = ?

                        WHERE email = ?

                    `;


                    db.query(
                        updateSql,
                        [
                            newPasswordHash,
                            admin.email
                        ],
                        (
                            updateErr
                        ) => {

                            if (
                                updateErr
                            ) {

                                console.error(
                                    "❌ Password update error:",
                                    updateErr
                                );

                                return res.status(500).json({

                                    success: false,

                                    message:
                                        "Password update failed."

                                });

                            }


                            console.log(
                                "✅ Admin password changed:",
                                admin.email
                            );


                            return res.json({

                                success: true,

                                message:
                                    "Password changed successfully."

                            });

                        }
                    );

                }
            );

        }

        catch (error) {

            console.error(
                "❌ Change password error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Something went wrong."

            });

        }

    }
);
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
    String(Math.floor(Math.random() * 999999))
        .padStart(6, "0");

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
// GET ALL EVENTS
// ======================================

app.get("/events", (req, res) => {

    const sql =
        "SELECT * FROM events ORDER BY event_date ASC";


    db.query(
        sql,
        (err, results) => {

            if (err) {

                console.error(
                    "❌ GET EVENTS ERROR:",
                    err
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to load events.",

                    error:
                        err.message

                });

            }


            console.log(
                "✅ Events loaded:",
                results.length
            );


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
// UPDATE EVENT
// ======================================

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
            event_name = ?,
            event_date = ?,
            venue = ?,
            fee = ?,
            status = ?
        WHERE id = ?
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
        (err, result) => {

            if (err) {

                console.error(
                    "❌ Event update error:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Event update failed."

                });

            }


            res.json({

                success: true,

                message:
                    "Event updated successfully."

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
// VERIFY CERTIFICATE
// ======================================

app.get("/verify/:id", (req, res) => {

    const sql = `
    SELECT
        fullname,
        event,
        certificate_id,
        certificate_date
    FROM registrations
    WHERE certificate_id = ?
    `;

    db.query(sql, [req.params.id], (err, results) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                success: false
            });

        }

        if (results.length === 0) {

            return res.json({
                success: false,
                message: "Certificate Not Found"
            });

        }

        res.json({

            success: true,

            student: results[0]

        });

    });

});
// ======================================================
// PAYMENT VERIFICATION
// ======================================================

app.get("/payment-verification/:id", (req, res) => {

    const registrationId = req.params.id;

    if (!registrationId) {

        return res.status(400).json({
            success: false,
            message: "Registration ID is required."
        });

    }

    const sql = `
        SELECT
            id,
            fullname,
            email,
            college,
            department,
            year,
            event,
            payment_status,
            amount
        FROM registrations
        WHERE id = ?
        LIMIT 1
    `;

    db.query(
        sql,
        [registrationId],
        (err, results) => {

            if (err) {

                console.log(
                    "Payment verification error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Database verification failed."
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Payment record not found."
                });

            }

            const student = results[0];

            res.json({

                success: true,

                student: {

                    id: student.id,

                    fullname: student.fullname,

                    email: student.email,

                    college: student.college,

                    department: student.department,

                    year: student.year,

                    event: student.event,

                    payment_status:
                        student.payment_status,

                    amount:
                        student.amount

                }

            });

        }
    );

});
// ======================================
// SERVER START
// ======================================
const paymentSessions = {};

app.post("/create-payment-session", function (req, res) {

    const {
        sessionId,
        registrationData,
        paymentMethod
    } = req.body;

    if (!sessionId) {
        return res.status(400).json({
            success: false,
            message: "Session ID is required"
        });
    }

    paymentSessions[sessionId] = {
        sessionId: sessionId,
        status: "waiting",
        scanned: false,
        createdAt: new Date(),
        paymentMethod: paymentMethod || "QR Payment",
        registrationData: registrationData || {},
        amount: 1000,
        transactionId: null,
        paymentDate: null
    };

    res.json({
        success: true,
        sessionId: sessionId,
        status: "waiting"
    });

});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("======================================");
    console.log("🚀 College Event Manager Started");
    console.log("🌐 Running on Port:", PORT);
    console.log("======================================");

});