const path = require("path");
const express = require("express");
const { uptime } = require("process");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

const dbPath = path.join(__dirname, "../../database/testJam.db");

// SQLite DB setup
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to the testJam.db SQLite database.");
  }
});

// ===================
// USERS CRUD Routes
// ===================

// Create User
app.post("/users", (req, res) => {
  const { name, email, password } = req.body;
  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, password], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User created", userID: this.lastID });
  });
});

// Get All Users
app.get("/users", (req, res) => {
  const sql = `SELECT * FROM users`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Update User
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  let updateVars = " ";
  let multiUpdate = false
  let inserts = []
  if (name != null){
    updateVars += "name = ?"
    inserts.push(name)
    multiUpdate = true
  }
  if (email != null){
    if (multiUpdate) {
      updateVars += ",  email = ?"
    } else {
      multiUpdate = true
      updateVars += " email = ?"
    }
    inserts.push(email)
  }
  if (password != null){
    if (multiUpdate) {
      updateVars += ", password = ?"
    } else {
      updateVars += " password = ?"
    }
    inserts.push(password)
  }
  inserts.push(id)
  const sql = "UPDATE users SET" + updateVars + " WHERE user_id = ?";
  db.run(sql, inserts, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User updated", changes: this.changes });
  });
});

// Delete User
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM users WHERE user_id = ?`;
  db.run(sql, id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User deleted", changes: this.changes });
  });
});

// ================================
// USER-PROJECT RELATIONSHIP CRUD Routes
// ================================

// Create User-Project Relationship
app.post("/user-project", (req, res) => {
  const { userID, projectID } = req.body;
  const sql = `INSERT INTO UserProjectRelationShips (user_ID, project_ID) VALUES (?, ?)`;
  db.run(sql, [userID, projectID], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User-Project relationship created" });
  });
});

// Get All User-Project Relationships
app.get("/user-project", (req, res) => {
  const sql = `SELECT * FROM UserProjectRelationShips`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Delete User-Project Relationship
app.delete("/user-project", (req, res) => {
  const { userID, projectID } = req.body;
  const sql = `DELETE FROM UserProjectRelationShips WHERE user_ID = ? AND project_ID = ?`;
  db.run(sql, [userID, projectID], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: "User-Project relationship deleted",
      changes: this.changes,
    });
  });
});

// ===================
// PROJECTS CRUD Routes
// ===================

// Create Project
app.post("/projects", (req, res) => {
  const { name, created, edited } = req.body;
  const sql = `INSERT INTO Projects (project_Name, creation_Date, last_Edited) VALUES (?, ?, ?)`;
  db.run(sql, [name, created, edited], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Project created", projectID: this.lastID });
  });
});

// Get All Projects
app.get("/projects", (req, res) => {
  const sql = `SELECT * FROM Projects`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Update Project
app.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { name, edited } = req.body;
  let updateVars = " ";
  let multiUpdate = false
  let inserts = []
  if (name != null){
    updateVars += "project_Name = ?"
    multiUpdate = true
    inserts.push(name)
  }
  if (edited != null){
    if (multiUpdate){
      updateVars += ", "
    }
    updateVars += "last_Edited = ?"
    inserts.push(edited)
  }
  inserts.push(id)
  const sql = `UPDATE Projects SET ${updateVars} WHERE project_ID = ?`;
  db.run(sql, inserts, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Project updated", changes: this.changes });
  });
});

// Delete Project
app.delete("/projects/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM Projects WHERE project_ID = ?`;
  db.run(sql, id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Project deleted", changes: this.changes });
  });
});

// ===================
// TEXTFILES CRUD Routes
// ===================

// Create Text File
app.post("/textfiles", (req, res) => {
  const { name, projectID } = req.body;
  const sql = `INSERT INTO Textfiles (file_Name, project_ID) VALUES (?, ?)`;
  db.run(sql, [name, projectID], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Text file created", textFileID: this.lastID });
  });
});

// Get All Text Files
app.get("/textfiles", (req, res) => {
  const sql = `SELECT * FROM Textfiles`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Update Text File
app.put("/textfiles/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const sql = `UPDATE Textfiles SET file_Name = ? WHERE text_File_ID = ?`;
  db.run(sql, [name, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Text file updated", changes: this.changes });
  });
});

// Delete Text File
app.delete("/textfiles/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM Textfiles WHERE text_File_ID = ?`;
  db.run(sql, id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Text file deleted", changes: this.changes });
  });
});

// ===================
// AUDIOFILES CRUD Routes
// ===================

// Create Audio File
app.post("/audiofiles", (req, res) => {
  const { name, projectID } = req.body;
  const sql = `INSERT INTO Audiofiles (file_Name, project_ID) VALUES (?, ?)`;
  db.run(sql, [name, projectID], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Audio file created", audioFileID: this.lastID });
  });
});

// Get All Audio Files
app.get("/audiofiles", (req, res) => {
  const sql = `SELECT * FROM Audiofiles`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Update Audio File
app.put("/audiofiles/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const sql = `UPDATE Audiofiles SET file_Name = ? WHERE audio_File_ID = ?`;
  db.run(sql, [name, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Audio file updated", changes: this.changes });
  });
});

// Delete Audio File
app.delete("/audiofiles/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM AudioFiles WHERE audio_File_ID = ?`;
  db.run(sql, id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Audio file deleted", changes: this.changes });
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
