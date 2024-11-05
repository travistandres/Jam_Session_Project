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

// Create Audio File (Updated with check)
router.post("/", (req, res) => {
    openDb();
    const { name, projectID } = req.body;

    //Verifying that the project belongs to the user before allowing them to add a audio file
    const doesProjectBelongToUser = `SELECT * From UserProjectRelationships WHERE project_ID = ? AND user_ID = ?`;
    db.get(doesProjectBelongToUser, [projectID, req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(403).json({ error: "Access Forbidden"});
    })

    const sql = `INSERT INTO Audiofiles (file_Name, project_ID) VALUES (?, ?)`;
    db.run(sql, [name, projectID], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Audio file created", audioFileID: this.lastID });
    });
    db.close();
});


//Think the updated get method to get specific audio files based on ID's
router.get("/", (req, res) => {
    openDb();
    const { projectID, audioFileID} = req.query;

    const sql = `SELECT * FROM Audiofiles JOIN UserProjectRelationships ON Audiofiles.project_ID = UserProjectRelationships.project_ID
                 WHERE Audiofiles.project_ID = ? AND Audiofiles.audio_File_ID = ? AND UserProjectRelationships.user_ID = ?`;
    db.all(sql, [projectID, audioFileID, req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
    db.close();
});
  


// Update Audio File (updated with check)
router.put("/:id", (req, res) => {
    openDb();
    const { id, projectID } = req.params; //Added projectID to use in check for access
    const { name } = req.body;

    //Verifying that the project belongs to the user before allowing to delete the audio file
    const doesProjectBelongToUser = `SELECT * From UserProjectRelationships WHERE project_ID = ? AND user_ID = ?`;
    db.get(doesProjectBelongToUser, [projectID, req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(403).json({ error: "Access Forbidden"});
    })

    const sql = `UPDATE Audiofiles SET file_Name = ? WHERE audio_File_ID = ?`;
    db.run(sql, [name, id], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Audio file updated", changes: this.changes });
    });
    db.close();
  });


  

// Delete Audio File (updated with check)
router.delete("/:id", (req, res) => {
    openDb();
    const { id, projectID } = req.params; //Added projectID to use in check for access

    //Verifying that the project belongs to the user before allowing to delete the audio file
    const doesProjectBelongToUser = `SELECT * From UserProjectRelationships WHERE project_ID = ? AND user_ID = ?`;
    db.get(doesProjectBelongToUser, [projectID, req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(403).json({ error: "Access Forbidden"});
    })

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