require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql2");

const app = express();

app.use(cors());
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
  }
});

app.use(session({
  secret: "college_event_manager_secret",
  resave: false,
  saveUninitialized: false
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
      attendance
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      "Absent"
    ],
    (err, result) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: err.message
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
// LOGIN
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
        success: false
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
        return res.redirect("/login.html");
    }

    res.sendFile(path.join(__dirname, "admin.html"));

});

// ===============================
// GET ALL STUDENTS
// ===============================

app.get("/students", (req, res) => {

    const sql = "SELECT * FROM registrations ORDER BY id DESC";

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
            message: "Access Denied"
        });
    }

    const sql = "SELECT * FROM registrations ORDER BY id DESC";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json([]);
        }

        res.json(results);

    });

});
// ===============================
// MARK ATTENDANCE
// ===============================

app.put("/attendance/:id", (req, res) => {

    const certificateId = "ABC2027-" + req.params.id;

    const sql = `
    UPDATE registrations
    SET attendance='Present',
        certificate_id=?
    WHERE id=?
    `;

    db.query(sql, [certificateId, req.params.id], (err) => {

        if (err) {
            console.log(err);
            return res.json({ success: false });
        }

        res.json({ success: true });

    });

});

// ===============================
// CERTIFICATE
// ===============================

app.get("/certificate/:id", (req, res) => {

    const sql = "SELECT * FROM registrations WHERE id=?";

    db.query(sql, [req.params.id], (err, results) => {

        if (err || results.length === 0) {
            return res.json({});
        }

        res.json(results[0]);

    });

});

// ===============================
// CLEAR ALL
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
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("==================================");
    console.log("🚀 College Event Manager Running");
    console.log("Port : " + PORT);
    console.log("==================================");

});