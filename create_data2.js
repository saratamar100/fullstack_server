const mysql = require("mysql2");
const http = require("http");

const getDataJPH = async (path_name) => {
  const options = {
    hostname: "jsonplaceholder.typicode.com",
    path: `/${path_name}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let data = "";

  return new Promise((resolve, reject) => {
    const request = http.request(options, (response) => {
      // Set the encoding, so we don't get logged a bunch of gibberish binary data
      response.setEncoding("utf8");

      // As data starts streaming in, add each chunk to "data"
      response.on("data", (chunk) => {
        data += chunk;
      });

      // The whole response has been received
      response.on("end", () => {
        console.log("Finish Get Data");
        resolve(data); // Resolve the promise with the received data
      });
    });

    // Log errors if any occur
    request.on("error", (error) => {
      reject(error); // Reject the promise if an error occurs
    });

    // End the request
    request.end();
  });
};

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "bsnt770",
  port: 3306,
  database: "FullStackProject6",
});

con.connect(async (err) => {
  if (err) throw err;
  console.log("Connected!");

  var sql = "DROP TABLE IF EXISTS passwords";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table deleted");
  });

  const convertTypes = { number: "INT", string: "VARCHAR(512)" };
  const tableNames = ["users", "posts", "todos", "comments"];
  // loop through the list:
  for (const tableName of tableNames) {
    // make api call to jsonplaceholder
    let data = await getDataJPH(tableName);
    data = JSON.parse(data);

    // set string to create table
    let sql = `CREATE TABLE ${tableName} (`;
    const instanceExample = data[0];
    Object.entries(instanceExample).forEach(([key, value]) => {
      const value_type = typeof value;
      if (value_type === "number" || value_type === "string")
        sql += `${key} ${convertTypes[value_type]},`;
    });
    sql = sql.slice(0, -1) + ")";

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
    });

    // set string to insert into the table
    sql = `INSERT INTO ${tableName} (`;
    Object.entries(instanceExample).forEach(([key, value]) => {
      const value_type = typeof value;
      if (value_type === "number" || value_type === "string") sql += `${key},`;
    });
    sql = sql.slice(0, -1) + ") VALUES ?";
    // set values for the table
    const values = data.map((instance) => {
      return Object.values(instance).filter(
        (value) => typeof value === "number" || typeof value === "string"
      );
    });
    // make a query
    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  }

  // Create user-password Table
  con.query("SELECT id, username FROM users", function (err, result, fields) {
    if (err) throw err;
    result = result.map((value) => {
      return { ...value, password: generateRandomString(8) };
    });
    let sql =
      "CREATE TABLE passwords (id INT, username VARCHAR(32), password VARCHAR(32))";
    con.query(sql, function (err, result2) {
      if (err) throw err;

      sql = "INSERT INTO passwords (";
      Object.entries(result[0]).forEach(([key, value]) => {
        sql += `${key},`;
      });
      sql = sql.slice(0, -1) + ") VALUES ?";
      // set values for the table
      const values = result.map((instance) => {
        return Object.values(instance);
      });
      // make a query
      con.query(sql, [values], function (err, result3) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
      });
    });
  });
});
