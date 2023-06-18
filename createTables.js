// Import required modules
const mysql = require('mysql2');


// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.argv[2],
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Failed to connect to the MySQL server:', err);
    return;
  }
  console.log('Connected to the MySQL server');

  // Create the database if it doesn't exist
  connection.query('CREATE DATABASE IF NOT EXISTS fullstack6', (err) => {
    if (err) {
      console.error('Failed to create database:', err);
      return;
    }

    // Switch to the newly created database
    connection.query('USE fullstack6', (err) => {
      if (err) {
        console.error('Failed to switch to the database:', err);
        return;
      }
      console.log('Using the database: fullstack6');

      // Create the users table
      const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        city VARCHAR(255)
      )`;
      
      connection.query(createUsersTable, (err) => {
        if (err) {
          console.error('Failed to create users table:', err);
          return;
        }
        console.log('Users table created successfully');
      });

      // Create the todos table
      const createTodosTable = `CREATE TABLE IF NOT EXISTS todos (
        todo_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        todo_description VARCHAR(255) NOT NULL,
        todo_status ENUM('pending', 'completed') DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )`;
      connection.query(createTodosTable, (err) => {
        if (err) {
          console.error('Failed to create todos table:', err);
          return;
        }
        console.log('Todos table created successfully');
      });

      // Create the posts table
      const createPostsTable = `CREATE TABLE IF NOT EXISTS posts (
        post_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        post_title VARCHAR(255) NOT NULL,
        post_content TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )`;
      connection.query(createPostsTable, (err) => {
        if (err) {
          console.error('Failed to create posts table:', err);
          return;
        }
        console.log('Posts table created successfully');
      });

      // Create the comments table
      const createCommentsTable = `CREATE TABLE IF NOT EXISTS comments (
        comment_id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT,
        user_id INT,
        comment_content TEXT,
        FOREIGN KEY (post_id) REFERENCES posts(post_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )`;
      connection.query(createCommentsTable, (err) => {
        if (err) {
          console.error('Failed to create comments table:', err);
          return;
        }
        console.log('Comments table created successfully');
      });

      // Close the MySQL connection
      connection.end((err) => {
        if (err) {
          console.error('Failed to close the connection:', err);
        }
      });
    });
  });
});
