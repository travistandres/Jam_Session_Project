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

// Create Text File
router.post("/", (req, res) => {
    openDb();
    const { name, projectID } = req.body;
    const sql = `INSERT INTO Textfiles (file_Name, project_ID) VALUES (?, ?)`;
    db.run(sql, [name, projectID], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Text file created", textFileID: this.lastID });
    });
    db.close();
});
  
// Get All Text Files
router.get("/", (req, res) => {
    openDb();
    const sql = `SELECT * FROM Textfiles`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
    db.close();
});

// Update Text File
router.put("/:id", (req, res) => {
    openDb();
    const { id } = req.params;
    const { name } = req.body;
    const sql = `UPDATE Textfiles SET file_Name = ? WHERE text_File_ID = ?`;
    db.run(sql, [name, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Text file updated", changes: this.changes });
    });
    db.close();
});
  
// Delete Text File
router.delete("/:id", (req, res) => {
    openDb();
    const { id } = req.params;
    const sql = `DELETE FROM Textfiles WHERE text_File_ID = ?`;
    db.run(sql, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Text file deleted", changes: this.changes });
    });
    db.close();
});

module.exports = router;