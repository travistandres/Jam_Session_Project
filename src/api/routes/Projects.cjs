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

// Create Project
//Was decided to not add check for relationship because would be first instance of the project
router.post("/", (req, res) => {
    openDb();
    const { name, created, edited } = req.body;
    const sql = `INSERT INTO Projects (project_Name, creation_Date, last_Edited, owner) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, created, edited, req.user.id], function (err) {
      if (err) {
        db.close()
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Project created", projectID: this.lastID });
    });
    db.close();
});
  


  
// Update Project (Updated with check)
router.put("/:id", (req, res) => {
    openDb();
    const { id } = req.params;
    const { name, edited } = req.body;

    //Verifying that the project belongs to the user before allowing to update the project
    const doesProjectBelongToUser = `SELECT * From UserProjectsRelationships WHERE project_ID = ? AND user_ID = ?`;
    db.get(doesProjectBelongToUser, [id, req.user.id], (err, row) => {
    if (err) {
      db.close();
      return res.status(500).json({ error: err.message })
    }
    else if (!row) {
      db.close();
      return res.status(403).json({ error: "Access Forbidden"});
    }
    
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
    const sql = "UPDATE Projects SET" + updateVars + " WHERE project_ID = ?";
    db.run(sql, inserts, function (err) {
      if (err) {
        db.close();
        return res.status(500).json({ error: err.message });
      }
      else {
        db.close();
        return res.json({ message: "Project updated", changes: this.changes });
      }
    });
  })
});
  
//Use a join query to return user and all their projects
router.get("/", (req, res) =>{
  openDb();
  const sql = ` Select * FROM Projects JOIN UserProjectRelationships ON Projects.project_ID = UserProjectRelationships.project_ID 
                       WHERE UserProjectRelationships.user_ID = ? `;
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({error: err.message });
    }
    res.json(rows);
  })
  db.close();
})

// Delete Project (Updated with check)
router.delete("/:id", (req, res) => {
  openDb();
  //Verifying that the project belongs to the user before allowing to delete the project
  const doesProjectBelongToUser = `SELECT * From UserProjectRelationships WHERE project_ID = ? AND user_ID = ?`;
  db.get(doesProjectBelongToUser, [id, req.user.id], (err, row) => {
  if (err) {
    db.close()
    return res.status(500).json({ error: err.message });
  }
  if (!row) {
    db.close()
    return res.status(403).json({ error: "Access Forbidden"})
  } else {
    const sql = `DELETE FROM Projects WHERE project_ID = ?`;
    db.run(sql, id, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Project deleted", changes: this.changes });
    });
    db.close();
  }
 }) 
});

module.exports = router;