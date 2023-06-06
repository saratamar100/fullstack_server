const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'my_database',
});

connection.connect((err) => {
  if (err) {
    console.error('Failed to connect to the MySQL server:', err);
    return;
  }
  console.log('Connected to the MySQL server');
});

// Retrieve all users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch users:', err);
      res.status(500).json({ error: 'Failed to fetch users' });
    } else {
      res.json(results);
    }
  });
});

// Create a new user
app.post('/users', (req, res) => {
  const { username, password } = req.body;
  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  connection.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Failed to create user:', err);
      res.status(500).json({ error: 'Failed to create user' });
    } else {
      res.status(201).json({ message: 'User created successfully' });
    }
  });
});

// Update a user
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { username, password } = req.body;
  const query = 'UPDATE users SET username = ?, password = ? WHERE user_id = ?';
  connection.query(query, [username, password, userId], (err, result) => {
    if (err) {
      console.error('Failed to update user:', err);
      res.status(500).json({ error: 'Failed to update user' });
    } else {
      res.json({ message: 'User updated successfully' });
    }
  });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM users WHERE user_id = ?';
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Failed to delete user:', err);
      res.status(500).json({ error: 'Failed to delete user' });
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  });
});

// Other routes for todos, posts, and comments can be added similarly

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
