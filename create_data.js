const mysql = require('mysql2');
const http = require('http');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "bsnt770", // your password here
    port: 3306,
  });
  
con.connect(async function(err) {
    if (err) throw err;
    console.log("Connected!");


    con.query("CREATE DATABASE FullStackProject6", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
});