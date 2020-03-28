const mysql = require('mysql');

const con = mysql.createConnection({
  host: process.env.AWS_HOST,
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD
});

con.connect(function (err) {
  if (err) throw err;

  console.log("CONNECTED");

  con.query('CREATE DATABASE IF NOT EXISTS contactList;');
  con.query('USE contactList;');
  con.query('CREATE TABLE IF NOT EXISTS contacts(id SERIAL PRIMARY KEY, name VARCHAR(255), phone VARCHAR(255), email VARCHAR(320));', function (error, result, fields) {
    console.log(result);
  });

  con.end();
});