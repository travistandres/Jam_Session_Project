const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const router = express.Router();
const authenticateJWT = require('../JWTAuth.cjs');

router.use(authenticateJWT)

const dbPath = path.join(__dirname, "../../database/testJam.db");

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

// Create Project
router.post("/", (req, res) => {
    openDb();
    const { name, created, edited } = req.body;
    const sql = `INSERT INTO Projects (project_Name, creation_Date, last_Edited) VALUES (?, ?, ?)`;
    db.run(sql, [name, created, edited], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Project created", projectID: this.lastID });
    });
    db.close();
});
  
// Get All Projects
router.get("/", (req, res) => {
    openDb();
    const sql = `SELECT * FROM Projects`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
    db.close();
});
  
// Update Project
router.put("/:id", (req, res) => {
    openDb();
    const { id } = req.params;
    const { name, edited } = req.body;
    let updateVars = " ";
    let multiUpdate = false;
    let inserts = [];
    if (name != null) {
        updateVars += "project_Name = ?";
        multiUpdate = true;
        inserts.push(name);
    }
    if (edited != null) {
        if (multiUpdate) {
            updateVars += ", ";
        }
        updateVars += "last_Edited = ?";
        inserts.push(edited);
    }
    inserts.push(id);
    const sql = `UPDATE Projects SET ${updateVars} WHERE project_ID = ?`;
    db.run(sql, inserts, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Project updated", changes: this.changes });
    });
    db.close();
});
  
// Delete Project
router.delete("/:id", (req, res) => {
  openDb();
  const { id } = req.params;
  const sql = `DELETE FROM Projects WHERE project_ID = ?`;
  db.run(sql, id, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Project deleted", changes: this.changes });
  });
  db.close();
});

module.exports = router;