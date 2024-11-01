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

// Create Audio File
router.post("/", (req, res) => {
    openDb();
    const { name, projectID } = req.body;
    const sql = `INSERT INTO Audiofiles (file_Name, project_ID) VALUES (?, ?)`;
    db.run(sql, [name, projectID], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Audio file created", audioFileID: this.lastID });
    });
    db.close();
});
  
// Get All Audio Files
router.get("/", (req, res) => {
    openDb();
    const sql = `SELECT * FROM Audiofiles`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
    db.close();
});
  
// Update Audio File
router.put("/:id", (req, res) => {
    openDb();
    const { id } = req.params;
    const { name } = req.body;
    const sql = `UPDATE Audiofiles SET file_Name = ? WHERE audio_File_ID = ?`;
    db.run(sql, [name, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Audio file updated", changes: this.changes });
    });
    db.close();
});
  
// Delete Audio File
router.delete("/:id", (req, res) => {
    openDb();
    const { id } = req.params;
    const sql = `DELETE FROM AudioFiles WHERE audio_File_ID = ?`;
    db.run(sql, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Audio file deleted", changes: this.changes });
    });
    db.close();
});

module.exports = router;