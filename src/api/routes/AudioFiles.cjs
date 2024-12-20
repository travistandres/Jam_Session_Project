const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const router = express.Router();
const authenticateJWT = require("../JWTAuth.cjs");
const multer = require("multer");
const cors = require("cors");

router.use(cors());

router.use(authenticateJWT);

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

// Set up Multer to handle audio file uploads in memory (as a Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create Audio File (Updated with check)
router.post("/", upload.single("audio"), (req, res) => {
  openDb();
  const { name, projectID } = req.body;

  if (!req.file) {
    db.close();
    return res.status(400).json({ error: "No audio file uploaded" });
  }

  const audioBuffer = req.file.buffer; // This is the binary data of the uploaded file

  //Verifying that the project belongs to the user before allowing them to add a audio file
  const doesProjectBelongToUser = `SELECT * From UserProjectRelationships WHERE project_ID = ? AND user_ID = ?`;
  db.get(doesProjectBelongToUser, [projectID, req.user.id], (err, row) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: err.message });
    } else if (!row) {
      db.close();
      return res.status(403).json({ error: "Access Forbidden" });
    }
    const sql = `INSERT INTO Audiofiles (file_Name, project_ID, audio) VALUES (?, ?, ?)`;
    db.run(sql, [name, projectID, audioBuffer], function (err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Audio file created", audioFileID: this.lastID });
      }
    });
    db.close();
  });
});

router.get("/:projectID", (req, res) => {
  openDb();
  const { projectID } = req.params;

  const sql = `SELECT * FROM Audiofiles JOIN UserProjectRelationships ON Audiofiles.project_ID = UserProjectRelationships.project_ID
                 WHERE Audiofiles.project_ID = ? AND UserProjectRelationships.user_ID = ?`;
  db.all(sql, [projectID, req.user.id], (err, rows) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
    db.close();
  });
});

// Update Audio File (updated with check)
/**
 * for the given values id and projectId seperate them via a :
 */
router.put("/:audioID", (req, res) => {
  openDb();
  const { audioID } = req.params; //Added projectID to use in check for access
  const { projectID, name, audio } = req.body;
  let multiUpdate = false;
  let inserts = [];
  let setQuery = " ";

  //Verifying that the project belongs to the user before allowing to delete the audio file
  const doesProjectBelongToUser = `SELECT * From UserProjectRelationships WHERE project_ID = ? AND user_ID = ?`;
  db.get(doesProjectBelongToUser, [projectID, req.user.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else if (!row) return res.status(403).json({ error: "Access Forbidden" });
    if (name != null) {
      multiUpdate = true;
      setQuery += "file_Name = ?";
      inserts.push(name);
    }
    if (audio != null) {
      if (multiUpdate) {
        setQuery += ",";
      }
      setQuery += " audio = ?";
      inserts.push(audio);
    }
    inserts.push(audioID);

    const sql = "UPDATE Audiofiles SET" + setQuery + " WHERE audio_File_ID = ?";
    db.run(sql, inserts, function (err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Audio file updated", changes: this.changes });
    });
    db.close();
  });
});

// Delete Audio File (updated with check)
router.delete("/:id", (req, res) => {
  openDb();
  const { id } = req.params; //Added projectID to use in check for access
  const { projectID } = req.body;
  //Verifying that the project belongs to the user before allowing to delete the audio file
  const doesProjectBelongToUser = `SELECT * From UserProjectRelationships WHERE project_ID = ? AND user_ID = ?`;
  db.get(doesProjectBelongToUser, [projectID, req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    else if (!row) return res.status(403).json({ error: "Access Forbidden" });

    const sql = `DELETE FROM AudioFiles WHERE audio_File_ID = ?`;
    db.run(sql, id, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Audio file deleted", changes: this.changes });
    });
    db.close();
  });
});

// Delete Audio File (updated with check)
router.delete("/", (req, res) => {
  openDb();
  const { projectID } = req.body; //Added projectID to use in check for access

  //Verifying that the project belongs to the user before allowing to delete the audio file
  const doesProjectBelongToUser = `SELECT * From UserProjectRelationships WHERE project_ID = ? AND user_ID = ?`;
  db.get(doesProjectBelongToUser, [projectID, req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    else if (!row) return res.status(403).json({ error: "Access Forbidden" });
    const sql = `DELETE FROM AudioFiles WHERE project_ID = ?`;
    db.run(sql, projectID, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Audio file deleted", changes: this.changes });
    });
    db.close();
  });
});

module.exports = router;
