const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
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

// Create Text File (Updated with check)
router.post("/", (req, res) => {
    openDb();
    const { name, projectID, lyrics, notes } = req.body;

    //Verifying that the project belongs to the user before allowing them to create a text file
    const doesProjectBelongToUser = `SELECT * From UserProjectRelationships WHERE project_ID = ? AND user_ID = ?`;
    db.get(doesProjectBelongToUser, [projectID, req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(403).json({ error: "Access Forbidden"});
    })
    
    const sql = `INSERT INTO Textfiles (file_Name, project_ID) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, projectID, lyrics, notes], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Text file created", textFileID: this.lastID });
    });
    db.close();
});

router.get("/:projectID", (req, res) => {
    openDb();
    const { projectID } = req.params;

    const sql = `SELECT * FROM TextFiles JOIN UserProjectRelationships ON Textfiles.project_ID = UserProjectRelationships.project_ID
                 WHERE Textfiles.project_ID = ? AND UserProjectRelationships.user_ID = ?`;
    db.all(sql, [projectID, req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
    db.close();
});

// Update Text File (Updated with Check)
router.put("/:combinedValues", (req, res) => {
    openDb();
    const { textID, projectID } = req.params.combinedValues.split(":");
    const { name, lyrics, notes } = req.body;

   //Verifying that the project belongs to the user before allowing them to update a text file
   const doesProjectBelongToUser = `SELECT * From UserProjectRelationships WHERE project_ID = ? AND user_ID = ?`;
   db.get(doesProjectBelongToUser, [projectID, req.user.id], (err, row) => {
   if (err) {
    return res.status(500).json({ error: err.message })
   } else if (!row) {
    return res.status(403).json({ error: "Access Forbidden"})
   }})

   let multiUpdate = false;
   let inserts = []
   let setQuery = " "

   if (name != null) {
    setQuery += "name = ?";
    inserts.push(name);
    multiUpdate = true;
    }
    if (lyrics != null) {
        if (multiUpdate) {
            setQuery += ", ";
        }
        multiUpdate = true;
        setQuery += "lyrics = ?";
        inserts.push(lyrics);
    }
    if (notes != null) {
        if (multiUpdate) {
            setQuery += ", ";
        } else {
            setQuery += "notes = ?";
        }
        inserts.push(notes);
    }
    inserts.push(textID)

    const sql = "UPDATE Textfiles SET" + setQuery + " WHERE text_File_ID = ?";
    db.run(sql, inserts, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "Text file updated", changes: this.changes });
        }
    });
    db.close();
});
  

// Updated Delete Text File (With Check)
router.delete("/:id", (req, res) => {
    openDb();
    const { id } = req.params;
    const {projectID } = req.body
    
    //Verifying that the project belongs to the user before allowing them to delete a text file
    const doesProjectBelongToUser = `SELECT * From UserProjectRelationships WHERE project_ID = ? AND user_ID = ?`;
    db.get(doesProjectBelongToUser, [projectID, req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(403).json({ error: "Access Forbidden"});
    })

    const sql = `DELETE FROM Textfiles WHERE text_File_ID = ? `;
    db.run(sql, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Text file deleted", changes: this.changes });
    });
    db.close();
});


module.exports = router;