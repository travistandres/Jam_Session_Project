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
//Create unimplemented
function createUserProjectRelationShip(name, email) {
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(sql, [name, email], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User created with ID: ${this.lastID}`);
  });
}
//Read unimplemented
function readUserProjectRelationShips() {
  const sql = `SELECT * FROM users`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });
}
//Update unimplemented
function updateUserProjectRelationShip(id, name, email) {
  const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  db.run(sql, [name, email, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User updated with ID: ${id}`);
  });
}
//Delete unimplemented
function deleteUserProjectRelationShip(id) {
  const sql = `DELETE FROM users WHERE id = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User deleted with ID: ${id}`);
  });
}
//===================
//===Projects CRUD===
//===================
//Create unimplemented
function createProject(name, email) {
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(sql, [name, email], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User created with ID: ${this.lastID}`);
  });
}
//Read unimplemented
function readProjects() {
  const sql = `SELECT * FROM users`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });
}
//Update unimplemented
function updateProject(id, name, email) {
  const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  db.run(sql, [name, email, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User updated with ID: ${id}`);
  });
}
//Delete unimplemented
function deleteProject(id) {
  const sql = `DELETE FROM users WHERE id = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User deleted with ID: ${id}`);
  });
}
//===================
//===TextFiles CRUD===
//===================
//Create unimplemented
function createTextFile(name, email) {
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(sql, [name, email], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User created with ID: ${this.lastID}`);
  });
}
//Read unimplemented
function readTextFiles() {
  const sql = `SELECT * FROM users`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });
}
//Update unimplemented
function updateTextFile(id, name, email) {
  const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  db.run(sql, [name, email, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User updated with ID: ${id}`);
  });
}
//Delete unimplemented
function deleteTextFile(id) {
  const sql = `DELETE FROM users WHERE id = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User deleted with ID: ${id}`);
  });
}
//===================
//===AudioFiles CRUD===
//===================
//Create unimplemented
function createAudioFile(name, email) {
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(sql, [name, email], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User created with ID: ${this.lastID}`);
  });
}
//Read unimplemented
function readAudioFiles() {
  const sql = `SELECT * FROM users`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row);
    });
  });
}
//Update unimplemented
function updateAudioFile(id, name, email) {
  const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  db.run(sql, [name, email, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User updated with ID: ${id}`);
  });
}
//Delete unimplemented
function deleteAudioFile(id) {
  const sql = `DELETE FROM users WHERE id = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User deleted with ID: ${id}`);
  });
}

module.exports = {
  createAudioFile,
  createProject,
  createTextFile,
  createUser,
  createUserProjectRelationShip,
  readAllUsers,
  updateUser,
  deleteUser
}