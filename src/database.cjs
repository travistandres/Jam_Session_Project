const sqlite3 = require("sqlite3").verbose();

// Create a new database file or open an existing one
const db = new sqlite3.Database("../database/testJam.db", (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to the mydatabase.db SQlite database.");
  }
});

// Create a table
db.serialize(() => {
  db.run(
    `CREATE TABLE UserProjectRelationships (
    user_ID INTEGER NOT NULL, 
    project_ID INTEGER NOT NULL, 
    PRIMARY KEY (user_ID, project_ID), 
    FOREIGN KEY (user_ID) REFERENCES Users(user_ID), 
    FOREIGN KEY (project_ID) REFERENCES Projects(project_ID)
    );'

    CREATE TABLE Audiofiles (
    audio_File_ID INTEGER PRIMARY KEY AUTOINCREMENT, 
    file_Name TEXT NOT NULL, 
    project_ID INTEGER NOT NULL,
    FOREIGN KEY (project_ID) REFERENCES Projects(project_ID)
    );

    CREATE TABLE Textfiles (
    text_File_ID INTEGER PRIMARY KEY AUTOINCREMENT, 
    file_Name TEXT NOT NULL, 
    project_ID INTEGER NOT NULL,
    FOREIGN KEY (project_ID) REFERENCES Projects(project_ID)
    ); `,
    (err) => {
      if (err) {
        console.error("Error creating table: " + err.message);
      } else {
        console.log("Table created successfully.");
      }
    }
  );
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error("Error closing the database: " + err.message);
  } else {
    console.log("Database connection closed.");
  }
});
