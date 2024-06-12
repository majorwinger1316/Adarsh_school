const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Football@1316",
  database: "2024",
});

connection.connect((err) => {
  if (err) {
    console.error("Could not connect to database", err);
  } else {
    console.log("Connected to the MySQL database");
  }
});

module.exports = connection;
