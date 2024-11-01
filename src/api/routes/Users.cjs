const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const router = express.Router();
const authenticateJWT = require('../JWTAuth.cjs');

router.use(authenticateJWT)
const dbPath = path.join(__dirname, "../../database/testJam.db");

let db;

//Michael Toon
//Function to return hash from original input password during signup to store in database Michael Toon
async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
        const hashedPassword = bcrypt.hash(password, 10);
        const errorOccurred = false;

        if (errorOccurred) {
            reject(new Error("IDK HOW THE HELL FALSE IS TRUE"));
        } else {
            resolve(hashedPassword);
        }
        }, 5000); // Simulates a 2-second delay
    });
}

//Function to compare input password to stored hash to verify credentials for login MT
async function matchPassword(inputPassword, storedPassword) {
    return new Promise((resolve, reject) => {
    setTimeout(() => {
        const passwordMatch = bcrypt.compare(inputPassword, storedPassword);
        const errorOccurred = false;

        if (errorOccurred) {
        reject(new Error("IDK HOW THE HELL FALSE IS TRUE"));
        } else {
        resolve(passwordMatch);
        }
    }, 2000); // Simulates a 2-second delay
    });
}

// SQLite DB setup
function openDb() {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Error opening database " + err.message);
      } else {
        console.log("Connected to the testJam.db SQLite database.");
      }
    });
}

// Create User
router.post("/", (req, res) => {
    openDb();
    const { name, email, password } = req.body;

    // Hash the password
    hashPassword(password).then((hashedPassword) => {
        const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        db.run(sql, [name, email, hashedPassword], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "User created", userID: this.lastID });
        });
        db.close();
    });
});

// Get All Users
router.get("/", (req, res) => {
    openDb();
    const sql = `SELECT * FROM users`;
    db.all(sql, [], (err, rows) => {
        if (err) {
        return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
    db.close();
});

// Update User
router.put("/:ogEmail", (req, res) => {
    openDb();
    const { ogEmail } = req.params;
    const { name, email, password } = req.body;
    let updateVars = " ";
    let multiUpdate = false;
    let inserts = [];
    let backUpPlan = password;
    if (backUpPlan == null) {
        backUpPlan = "CrisesAdverted";
    }
    hashPassword(backUpPlan).then((hashedGodsPlan) => {
        if (name != null) {
            updateVars += "name = ?";
            inserts.push(name);
            multiUpdate = true;
        }
        if (email != null) {
            if (multiUpdate) {
                updateVars += ",  email = ?";
            } else {
                multiUpdate = true;
                updateVars += " email = ?";
            }
            inserts.push(email);
        }
        if (password != null) {
            if (multiUpdate) {
                updateVars += ", password = ?";
            } else {
                updateVars += " password = ?";
            }
            inserts.push(hashedGodsPlan);
        }
        inserts.push(ogEmail);
        const sql = "UPDATE users SET" + updateVars + " WHERE email = ?";
        db.run(sql, inserts, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "User updated", changes: this.changes });
        });
        db.close();
    });
});

// Delete User
router.delete("/:id", (req, res) => {
    openDb();
    const { id } = req.params;
    const sql = `DELETE FROM users WHERE user_id = ?`;
    db.run(sql, id, function (err) {
        if (err) {
        return res.status(500).json({ error: err.message });
        }
        res.json({ message: "User deleted", changes: this.changes });
    });
    db.close();
});

// ================================================
/* User Login */
// ================================================
// Login route
router.post("/login", (req, res) => {
    const { name, password } = req.body;
    openDb();
    // Retrieve the user from the database
    db.get(`SELECT * FROM users WHERE name = ?`, [name], (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Database error." });
        }
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        // Compare the hashed password
        matchPassword(password, user.password).then((isPasswordValid) => {
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials." });
        } else {
            res.json({ message: "Login successful!" });
            // Generate a JWT token
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
            expiresIn: "1h",
            });
        }
        });
    });
    db.close();
});

module.exports = router;