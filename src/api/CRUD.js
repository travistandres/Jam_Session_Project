// eslint-disable-next-line no-undef
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("../database/testJam.db", (err) => {
    if (err) {
      console.error("Error opening database " + err.message);
    } else {
      console.log("Connected to the mydatabase.db SQlite database.");
    }
});

//Make CRUD methods for each table

//CRUD OPERATIONS
//Create
export function createUser(name, email) {
  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
  db.run(sql, [name, email], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User created with ID: ${this.lastID}`);
  });
}

//Read
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
  
//Update
export function updateUser(id, name, email) {
    const sql = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
    db.run(sql, [name, email, id], function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`User updated with ID: ${id}`);
    });
  }
  
//Delete
export function deleteUser(id) {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.run(sql, id, function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`User deleted with ID: ${id}`);
    });
  }
  
//#Endregion