const path = require("path");
const express = require("express");
const { uptime } = require("process");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

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

// ===================
// USERS CRUD Routes
// ===================

// Create User
app.post("/users", (req, res) => {
  openDb();
  const { name, email, password } = req.body;

  // Hash the password
  hashPassword(password).then((hashedPassword) => {
    const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [name, email, hashedPassword], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "User created", userID: this.lastID });
    });
    db.close();
  });
});

// Get All Users
app.get("/users", (req, res) => {
  openDb();
  const sql = `SELECT * FROM users`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
  db.close();
});

// Update User
app.put("/users/:ogEmail", (req, res) => {
  openDb();
  const { ogEmail } = req.params;
  const { name, email, password } = req.body;
  let updateVars = " ";
  let multiUpdate = false;
  let inserts = [];
  let backUpPlan = password;
  if (backUpPlan == null) {
    backUpPlan = "CrisesAdverted";
  }
  hashPassword(backUpPlan).then((hashedGodsPlan) => {
    if (name != null) {
      updateVars += "name = ?";
      inserts.push(name);
      multiUpdate = true;
    }
    if (email != null) {
      if (multiUpdate) {
        updateVars += ",  email = ?";
      } else {
        multiUpdate = true;
        updateVars += " email = ?";
      }
      inserts.push(email);
    }
    if (password != null) {
      if (multiUpdate) {
        updateVars += ", password = ?";
      } else {
        updateVars += " password = ?";
      }
      inserts.push(hashedGodsPlan);
    }
    inserts.push(ogEmail);
    const sql = "UPDATE users SET" + updateVars + " WHERE email = ?";
    db.run(sql, inserts, function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "User updated", changes: this.changes });
    });
    db.close();
  });
});

// Delete User
app.delete("/users/:id", (req, res) => {
  openDb();
  const { id } = req.params;
  const sql = `DELETE FROM users WHERE user_id = ?`;
  db.run(sql, id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User deleted", changes: this.changes });
  });
  db.close();
});

// ================================
// USER-PROJECT RELATIONSHIP CRUD Routes
// ================================

// Create User-Project Relationship
app.post("/user-project", (req, res) => {
  openDb();
  const { userID, projectID } = req.body;
  const sql = `INSERT INTO UserProjectRelationShips (user_ID, project_ID) VALUES (?, ?)`;
  db.run(sql, [userID, projectID], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User-Project relationship created" });
  });
  db.close();
});

// Get All User-Project Relationships
app.get("/user-project", (req, res) => {
  openDb();
  const sql = `SELECT * FROM UserProjectRelationShips`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
  db.close();
});

// Delete User-Project Relationship
app.delete("/user-project", (req, res) => {
  openDb();
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
  db.close();
});

// ===================
// PROJECTS CRUD Routes
// ===================

// Create Project
app.post("/projects", (req, res) => {
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
app.get("/projects", (req, res) => {
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
app.put("/projects/:id", (req, res) => {
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
app.delete("/projects/:id", (req, res) => {
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

// ===================
// TEXTFILES CRUD Routes
// ===================

// Create Text File
app.post("/textfiles", (req, res) => {
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
app.get("/textfiles", (req, res) => {
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
app.put("/textfiles/:id", (req, res) => {
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
app.delete("/textfiles/:id", (req, res) => {
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

// ===================
// AUDIOFILES CRUD Routes
// ===================

// Create Audio File
app.post("/audiofiles", (req, res) => {
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
app.get("/audiofiles", (req, res) => {
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
app.put("/audiofiles/:id", (req, res) => {
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
app.delete("/audiofiles/:id", (req, res) => {
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

// ================================================
/* User Login */
// ================================================
// Login route
app.post("/login", (req, res) => {
  const { name, password } = req.body;
  openDb();
  // Retrieve the user from the database
  db.get(`SELECT * FROM users WHERE name = ?`, [name], (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error." });
    }
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Compare the hashed password
    matchPassword(password, user.password).then((isPasswordValid) => {
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid credentials." });
      } else {
        res.json({ message: "Login successful!" });
        // Generate a JWT token
        // const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
        //     expiresIn: "1h",
        // });
      }
    });
  });
  db.close();
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//Michael Toon
//Function to return hash from original input password during signup to store in database Michael Toon
async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const hashedPassword = bcrypt.hash(password, 10);
      const errorOccurred = false;

      if (errorOccurred) {
        reject(new Error("IDK HOW THE HELL FALSE IS TRUE"));
      } else {
        resolve(hashedPassword);
      }
    }, 5000); // Simulates a 2-second delay
  });
}
//Function to compare input password to stored hash to verify credentials for login MT
async function matchPassword(inputPassword, storedPassword) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const passwordMatch = bcrypt.compare(inputPassword, storedPassword);
      const errorOccurred = false;

      if (errorOccurred) {
        reject(new Error("IDK HOW THE HELL FALSE IS TRUE"));
      } else {
        resolve(passwordMatch);
      }
    }, 5000); // Simulates a 2-second delay
  });
}
