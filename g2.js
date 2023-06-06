const mysql = require('mysql');

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

  // Insert sample data into the users table
  const insertUsers = `INSERT INTO users (username, password) VALUES
    ('john', 'password123'),
    ('jane', 'securepassword'),
    ('mark', 'mysecretpass')`;

  connection.query(insertUsers, (err, result) => {
    if (err) {
      console.error('Failed to insert users:', err);
    } else {
      console.log('Users inserted successfully');
    }
  });

  // Insert sample data into the todos table
  const insertTodos = `INSERT INTO todos (user_id, todo_description, todo_status) VALUES
    (1, 'Buy groceries', 'pending'),
    (1, 'Finish homework', 'completed'),
    (2, 'Call the plumber', 'pending'),
    (3, 'Go for a run', 'completed')`;

  connection.query(insertTodos, (err, result) => {
    if (err) {
      console.error('Failed to insert todos:', err);
    } else {
      console.log('Todos inserted successfully');
    }
  });

  // Insert sample data into the posts table
  const insertPosts = `INSERT INTO posts (user_id, post_title, post_content) VALUES
    (1, 'Introduction', 'Hello, this is my first post'),
    (1, 'My Thoughts', 'Today, I want to talk about...'),
    (2, 'Tips and Tricks', 'Here are some useful tips...')`;

  connection.query(insertPosts, (err, result) => {
    if (err) {
      console.error('Failed to insert posts:', err);
    } else {
      console.log('Posts inserted successfully');
    }
  });

  // Insert sample data into the comments table
  const insertComments = `INSERT INTO comments (post_id, user_id, comment_content) VALUES
    (1, 2, 'Great post!'),
    (1, 3, 'I completely agree with you'),
    (2, 1, 'Looking forward to your next post')`;

  connection.query(insertComments, (err, result) => {
    if (err) {
      console.error('Failed to insert comments:', err);
    } else {
      console.log('Comments inserted successfully');
    }
  });

  // Close the MySQL connection
  connection.end((err) => {
    if (err) {
      console.error('Failed to close the connection:', err);
    }
  });
});
