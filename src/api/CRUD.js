// eslint-disable-next-line no-undef
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("../database/testJam.db", (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    console.log("Connected to the testJam.db SQlite database.");
  }
});

//===================
//=====Users CRUD=====
//===================
//Create unimplemented
export function createUser(name, email) {
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(sql, [name, email], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User created with ID: ${this.lastID}`);
  });
}
//Read unimplemented
export function readUsers() {
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
export function updateUser(id, name, email) {
  const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  db.run(sql, [name, email, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User updated with ID: ${id}`);
  });
}
//Delete unimplemented
export function deleteUser(id) {
  const sql = `DELETE FROM users WHERE id = ?`;
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
export function createUserProjectRelationShip(name, email) {
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(sql, [name, email], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User created with ID: ${this.lastID}`);
  });
}
//Read unimplemented
export function readUserProjectRelationShips() {
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
export function updateUserProjectRelationShip(id, name, email) {
  const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  db.run(sql, [name, email, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User updated with ID: ${id}`);
  });
}
//Delete unimplemented
export function deleteUserProjectRelationShip(id) {
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
export function createProject(name, email) {
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(sql, [name, email], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User created with ID: ${this.lastID}`);
  });
}
//Read unimplemented
export function readProjects() {
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
export function updateProject(id, name, email) {
  const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  db.run(sql, [name, email, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User updated with ID: ${id}`);
  });
}
//Delete unimplemented
export function deleteProject(id) {
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
export function createTextFile(name, email) {
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(sql, [name, email], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User created with ID: ${this.lastID}`);
  });
}
//Read unimplemented
export function readTextFiles() {
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
export function updateTextFile(id, name, email) {
  const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  db.run(sql, [name, email, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User updated with ID: ${id}`);
  });
}
//Delete unimplemented
export function deleteTextFile(id) {
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
export function createAudioFile(name, email) {
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(sql, [name, email], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User created with ID: ${this.lastID}`);
  });
}
//Read unimplemented
export function readAudioFiles() {
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
export function updateAudioFile(id, name, email) {
  const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
  db.run(sql, [name, email, id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User updated with ID: ${id}`);
  });
}
//Delete unimplemented
export function deleteAudioFile(id) {
  const sql = `DELETE FROM users WHERE id = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User deleted with ID: ${id}`);
  });
}