const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const audioFilePath = path.join(__dirname, 'test_audio.m4a');

const audioData = fs.readFileSync(audioFilePath);

const dbPath = path.join(__dirname, 'testJam.db'); 
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

  const insertTestDataSQL = `INSERT INTO Audiofiles (audio_File_ID, file_Name, project_ID, audio) VALUES (?, ?, ?, ?)`;
  db.run(insertTestDataSQL, [ 2, "Johnnys Sensual Guitar Part", 3, audioData ], (err) => {
    if (err) {
      console.error("Error inserting test data:", err.message);
    } else {
      console.log("Test data inserted successfully.");
    }
  });

  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
  });

