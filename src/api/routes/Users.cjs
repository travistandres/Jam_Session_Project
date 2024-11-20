const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const router = express.Router();
const authenticateJWT = require('../JWTAuth.cjs');

router.use(authenticateJWT)
const dbPath = path.join(__dirname, "../../../database/testJam.db");

let db;



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


// Update User (updated with check)
router.put("/:id", (req, res) => {
    openDb();
    const { id } = req.params;
    const { name, email, password } = req.body;

    //Check against id from authenticated instance against registered email
    //Will probably have to change req.user.____
    if (req.user.id !== id) {
        return res.status(403).json({error: "Access Forbidden"})
    }


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
        inserts.push(id);
        const sql = "UPDATE users SET" + updateVars + " WHERE user_ID = ?";
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
router.delete("/", (req, res) => {
    openDb();
    const sql = `DELETE FROM users WHERE user_id = ?`;
    db.run(sql, req.user.id, function (err) {
        if (err) {
        return res.status(500).json({ error: err.message });
        }
        res.json({ message: "User deleted", changes: this.changes });
    });
    db.close();
});

module.exports = router;