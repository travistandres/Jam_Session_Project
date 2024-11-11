const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Middleware to parse JSON
app.use(express.json());

app.use(cors());
const dbPath = path.join(__dirname, "../../database/testJam.db");

// Import routes
const usersRouter = require("./routes/Users.cjs");
const projectsRouter = require("./routes/Projects.cjs");
const userProjectsRouter = require("./routes/UserProjects.cjs");
const textFilesRouter = require("./routes/TextFiles.cjs");
const audioFilesRouter = require("./routes/AudioFiles.cjs");

// Use routes
app.use("/api/users", usersRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/userProjects", userProjectsRouter);
app.use("/api/textFiles", textFilesRouter);
app.use("/api/audioFiles", audioFilesRouter);

function openDb() {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Error opening database " + err.message);
    } else {
      console.log("Connected to the testJam.db SQLite database.");
    }
  });
}

// Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
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
    }, 20); // Simulates a 2-second delay
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
    }, 20); // Simulates a 2-second delay
  });
}

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

//Defining Secret Key for signing purposes
const SECRET_KEY = process.env.JWT_SECRET || "3n@4#zC^d8F!q9J4^w@U9tP*lZ$eT0z";

app.post("/login", (req, res) => {
  const { name, email, password } = req.body;
  let whereVar
  let insert
  if (name != null) {
    whereVar = "name"
    insert = name
  } else {
    whereVar = "email"
    insert = email
  }
  openDb();
  // Retrieve the user from the database
  db.get(`SELECT * FROM users WHERE ${whereVar} = ?`, [insert], (err, user) => {
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
        // Generate a JWT token
        const token = jwt.sign(
          { id: user.user_ID, username: user.name },
          SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );
        res.json({ message: "Login successful!", token });
      }
    });
  });
  db.close();
});

module.exports = {PORT}