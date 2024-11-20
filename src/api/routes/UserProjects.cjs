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

// Create User-Project Relationship
router.post("/", (req, res) => {
    openDb();
    const { projectID } = req.body;
    const sql = `INSERT INTO UserProjectRelationShips (user_ID, project_ID) VALUES (?, ?)`;
    db.run(sql, [req.user.id, projectID], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "User-Project relationship created" });
    });
    db.close();
});

//Create User-Project Relation for someone else
router.post("/:userID", (req, res) => {
  openDb();
  const { userID } = req.params
  const { projectID } = req.body;
  const sql = `INSERT INTO UserProjectRelationShips (user_ID, project_ID) VALUES (?, ?)`;
  db.run(sql, [userID, projectID], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User-Project relationship created" });
  });
  db.close();
});
  
  
// Delete User-Project Relationship
router.delete("/:projectID", (req, res) => {
    openDb();
    const { projectID } = req.params;
    const sql = `DELETE FROM UserProjectRelationShips WHERE user_ID = ? AND project_ID = ?`;
    db.run(sql, [req.user.userID, projectID], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
        message: "User-Project relationship deleted",
        changes: this.changes,
        });
    });
    db.close();
});

//Updated Get method using project_ID  
router.get("/:projectID", (req, res) => {
  openDb();
  const { projectID } = req.params;
  const sql = `SELECT * FROM UserProjectRelationShips WHERE project_ID = ?`;
  db.all(sql, [projectID], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(rows);
  });
  db.close();
});

module.exports = router;