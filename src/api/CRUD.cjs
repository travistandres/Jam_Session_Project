const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/testJam.db", (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to the testJam.db SQlite database.");
  }
});

//===================
//=====Users CRUD=====
//===================
//Create working
/**
 * Creates a User that gets added to the Users Table
 * 
 * @param {string} name 
 * @param {string} email 
 * @param {*string} password 
 */
function createUser(name, email, password) {
  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, password], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User created with ID: ${this.lastID}`);
  });
}
//Read working
/**
 * Gets all user rows
 *
 * @returns {Promise} JSON representation of the user table.
 */
function readAllUsers() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users`;
    const returnedRows = { "rows": [] };

    db.all(sql, [], (err, rows) => {
      if (err) {
        return reject(err);
      }

      rows.forEach((row) => {
        let curRow = {
          "user_ID": row.user_ID,
          "name": row.name,
          "email": row.email,
          "password": row.password
        };
        returnedRows.rows.push(curRow);
      });

      console.log("Rows retrieved");
      const returnData = JSON.stringify(returnedRows);
      resolve(returnData);
    });
  });
}
//Update working
/**
 * Updates an existing user via their id changing their name, email, and password
 * 
 * @param {int} id 
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 */
function updateUser(id, name, email, password) {
  const sql = `UPDATE users SET name = ?, email = ?, password = ? WHERE user_id = ?`;
  db.run(sql, [name, email, password, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User updated with ID: ${id}`);
  });
}
//Delete working
/**
 * Deletes a User via their id
 * 
 * @param {int} id 
 */
function deleteUser(id) {
  const sql = `DELETE FROM users WHERE user_id = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User deleted with ID: ${id}`);
  });
}
//===============================
//=UserProjectRelationShips CRUD=
//===============================
//Create working
/**
 * Creates a new user project relationship via their IDs
 * @param {int} userID 
 * @param {*int} projectID 
 */
function createUserProjectRelationShip(userID, projectID) {
  const sql = `INSERT INTO UserProjectRelationShips (user_ID, project_ID) VALUES (?, ?)`;
  db.run(sql, [userID, projectID], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User Project Relation created`);
  });
}
//Read working
/**
 * Returns JSON object of returned rows
 * @returns {Promise} of rows
 */
function readUserProjectRelationShips() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM UserProjectRelationShips`;
    const returnedRows = { "rows": [] };

    db.all(sql, [], (err, rows) => {
      if (err) {
        return reject(err);
      }

      rows.forEach((row) => {
        let curRow = {
          "user_ID": row.user_ID,
          "project_ID": row.project_ID
        };
        returnedRows.rows.push(curRow);
      });

      console.log("Rows retrieved");
      const returnData = JSON.stringify(returnedRows);
      resolve(returnData);
    });
  });
}
//Delete working
/**
 * deletes a user project relation via both IDs
 * @param {int} id 
 */
function deleteUserProjectRelationShip(userID, projectID) {
  const sql = `DELETE FROM UserProjectRelationShips WHERE user_ID = ? AND project_ID = ?`;
  db.run(sql, [userID, projectID], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User Project relation deleted`);
  });
}
//===================
//===Projects CRUD===
//===================
//Create working
/**
 * Creates a new project with name, creation date, and a last edited date
 * @param {String} name 
 * @param {Date} created 
 * @param {Date} edited 
 */
function createProject(name, created, edited) {
  const sql = `INSERT INTO Projects (project_Name, creation_Date, last_Edited) VALUES (?, ?, ?)`;
  db.run(sql, [name, created, edited], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Project created with ID: ${this.lastID}`);
  });
}
//Read working
/**
 * Returns JSON promise of row data
 * @returns {Promise}
 */
function readProjects() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Projects`;
    const returnedRows = { "rows": [] };

    db.all(sql, [], (err, rows) => {
      if (err) {
        return reject(err);
      }

      rows.forEach((row) => {
        let curRow = {
          "project_ID": row.project_ID,
          "name": row.project_Name,
          "dateCreated": row.creation_Date,
          "lastEdited": row.last_Edited
        };
        returnedRows.rows.push(curRow);
      });

      console.log("Rows retrieved");
      const returnData = JSON.stringify(returnedRows);
      resolve(returnData);
    });
  });
}
//Update working
/**
 * 
 * @param {String} name 
 * @param {Date} edited 
 * @param {Int} id 
 */
function updateProject(name, edited, id) {
  const sql = `UPDATE Projects SET project_Name = ?, last_Edited = ? WHERE project_ID = ?`;
  db.run(sql, [name, edited, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Project updated with ID: ${id}`);
  });
}
//Delete working
/**
 * Deletes a Project via its ID
 * @param {Int} id 
 */
function deleteProject(id) {
  const sql = `DELETE FROM Projects WHERE project_ID = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Project deleted with ID: ${id}`);
  });
}
//===================
//===TextFiles CRUD===
//===================
//Create working
function createTextFile(name, projectID) {
  const sql = `INSERT INTO Textfiles (file_Name, project_ID) VALUES (?, ?)`;
  db.run(sql, [name, projectID], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`TextFile created with ID: ${this.lastID}`);
  });
}
//Read working
/**
 * Returns JSON promise of row data
 * @returns {Promise} of row data
 */
function readTextFiles() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Textfiles`;
    const returnedRows = { "rows": [] };

    db.all(sql, [], (err, rows) => {
      if (err) {
        return reject(err);
      }

      rows.forEach((row) => {
        let curRow = {
          "file_ID": row.text_File_ID,
          "name": row.file_Name,
          "project_ID": row.project_ID
        };
        returnedRows.rows.push(curRow);
      });

      console.log("Rows retrieved");
      const returnData = JSON.stringify(returnedRows);
      resolve(returnData);
    });
  });
}
//Update working
/**
 * update a Textfile's Name via its ID
 * @param {Int} id 
 * @param {String} name 
 */
function updateTextFile(id, name) {
  const sql = `UPDATE Textfiles SET file_Name = ? WHERE text_File_ID = ?`;
  db.run(sql, [name, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Textfile updated with ID: ${id}`);
  });
}
//Delete working
/**
 * deletes a TextFile via its id
 * @param {Int} id 
 */
function deleteTextFile(id) {
  const sql = `DELETE FROM Textfiles WHERE text_File_ID = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Textfile deleted with ID: ${id}`);
  });
}
//===================
//==AudioFiles CRUD==
//===================
//Create working
/**
 * Creates an Audiofile with name and projectID
 * @param {String} name 
 * @param {Int} projectID 
 */
function createAudioFile(name, projectID) {
  const sql = `INSERT INTO Audiofiles (file_Name, project_ID) VALUES (?, ?)`;
  db.run(sql, [name, projectID], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Audiofile created with ID: ${this.lastID}`);
  });
}
//Read unimplemented
function readAudioFiles() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Audiofiles`;
    const returnedRows = { "rows": [] };

    db.all(sql, [], (err, rows) => {
      if (err) {
        return reject(err);
      }

      rows.forEach((row) => {
        let curRow = {
          "file_ID": row.audio_File_ID,
          "name": row.file_Name,
          "project_ID": row.project_ID
        };
        returnedRows.rows.push(curRow);
      });

      console.log("Rows retrieved");
      const returnData = JSON.stringify(returnedRows);
      resolve(returnData);
    });
  });
}
//Update working
/**
 * Update an audiofile's name via its ID
 * @param {Int} id 
 * @param {String} name 
 */
function updateAudioFile(id, name) {
  const sql = `UPDATE Audiofiles SET file_Name = ? WHERE audio_File_ID = ?`;
  db.run(sql, [name, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Audiofiles updated with ID: ${id}`);
  });
}
//Delete working
/**
 * Delete an Audiofile via its ID
 * @param {Int} id 
 */
function deleteAudioFile(id) {
  const sql = `DELETE FROM AudioFiles WHERE audio_File_ID = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Audiofile deleted with ID: ${id}`);
  });
}

module.exports = {
  createAudioFile,
  createProject,
  createTextFile,
  createUser,
  createUserProjectRelationShip,
  readAllUsers,
  readUserProjectRelationShips,
  readProjects,
  readTextFiles,
  readAudioFiles,
  updateUser,
  updateProject,
  updateTextFile,
  updateAudioFile,
  deleteUser,
  deleteUserProjectRelationShip,
  deleteProject,
  deleteTextFile,
  deleteAudioFile
}