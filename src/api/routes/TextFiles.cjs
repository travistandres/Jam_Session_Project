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

// Create Text File (Updated with check)
router.post("/", (req, res) => {
    openDb();
    const { name, projectID } = req.body;

    //Verifying that the project belongs to the user before allowing them to create a text file
    const doesProjectBelongToUser = `SELECT * From UserProjectRelationships WHERE project_ID = ? AND user_ID = ?`;
    db.get(doesProjectBelongToUser, [projectID, req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(403).json({ error: "Access Forbidden"});
    })
    
    const sql = `INSERT INTO Textfiles (file_Name, project_ID) VALUES (?, ?)`;
    db.run(sql, [name, projectID], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Text file created", textFileID: this.lastID });
    });
    db.close();
});

//Updated get for specific text files tied to a project
router.get("/", (req, res) => {
    openDb();
    const { projectID, textFileID} = req.query;

    const sql = `SELECT * FROM TextFiles JOIN UserProjectRelationships ON Textfiles.project_ID = UserProjectRelationships.project_ID
                 WHERE Textfiles.project_ID = ? AND Textfiles.text_File_ID = ? AND UserProjectRelationships.user_ID = ?`;
    db.all(sql, [projectID, textFileID, req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
    db.close();
});

// Update Text File (Updated with Check)
router.put("/:id", (req, res) => {
    openDb();
    const { id, projectID } = req.params;
    const { name } = req.body;

   //Verifying that the project belongs to the user before allowing them to update a text file
   const doesProjectBelongToUser = `SELECT * From UserProjectRelationships WHERE project_ID = ? AND user_ID = ?`;
   db.get(doesProjectBelongToUser, [projectID, req.user.id], (err, row) => {
   if (err) return res.status(500).json({ error: err.message });
   if (!row) return res.status(403).json({ error: "Access Forbidden"});
   })

    const sql = `UPDATE Textfiles SET file_Name = ? WHERE text_File_ID = ?`;
    db.run(sql, [name, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Text file updated", changes: this.changes });
    });
    db.close();
});
  

// Updated Delete Text File (With Check)
router.delete("/:id", (req, res) => {
    openDb();
    const { id, projectID } = req.params;
    
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