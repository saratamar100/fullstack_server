const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.argv[2],
  database: "my_database",
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

//fetch user by id
app.get('/users/:id', (req, res) => {
  const userId = req.query.id;
  let query = 'SELECT * FROM users WHERE userId=?';
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Failed to fetch user:', err);
      res.status(500).json({ error: 'Failed to fetch user' });
    } else {
      res.json(result[0]);
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
/* 
// Fetch all posts
app.get('/posts', (req, res) => {
  const query = 'SELECT * FROM posts';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch posts:', err);
      res.status(500).json({ error: 'Failed to fetch posts' });
    } else {
      res.json(results);
    }
  });
});
 */

//fetch all posts by userId:
app.get('/posts', (req, res) => {
  const userId = req.query.userId;
  let query = 'SELECT * FROM posts WHERE userId=?';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Failed to fetch posts:', err);
      res.status(500).json({ error: 'Failed to fetch posts' });
    } else {
      res.json(results);
    }
  });
});

//fetch post by id
app.get('/posts/:id', (req, res) => {
  const postId = req.query.id;
  let query = 'SELECT * FROM posts WHERE postId=?';
  connection.query(query, [postId], (err, result) => {
    if (err) {
      console.error('Failed to fetch post:', err);
      res.status(500).json({ error: 'Failed to fetch post' });
    } else {
      res.json(result[0]);
    }
  });
});

// Create a new post
app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  const query = 'INSERT INTO posts (title, content) VALUES (?, ?)';
  connection.query(query, [title, content], (err, result) => {
    if (err) {
      console.error('Failed to create post:', err);
      res.status(500).json({ error: 'Failed to create post' });
    } else {
      res.status(201).json({ message: 'Post created successfully' });
    }
  });
});

// Update a post
app.put('/posts/:id', (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  const query = 'UPDATE posts SET title = ?, content = ? WHERE post_id = ?';
  connection.query(query, [title, content, postId], (err, result) => {
    if (err) {
      console.error('Failed to update post:', err);
      res.status(500).json({ error: 'Failed to update post' });
    } else {
      res.json({ message: 'Post updated successfully' });
    }
  });
});

// Delete a post
app.delete('/posts/:id', (req, res) => {
  const postId = req.params.id;
  const query = 'DELETE FROM posts WHERE post_id = ?';
  connection.query(query, [postId], (err, result) => {
    if (err) {
      console.error('Failed to delete post:', err);
      res.status(500).json({ error: 'Failed to delete post' });
    } else {
      res.json({ message: 'Post deleted successfully' });
    }
  });
});

/* // Fetch all todos
app.get('/todos', (req, res) => {
  const query = 'SELECT * FROM todos';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch todos:', err);
      res.status(500).json({ error: 'Failed to fetch todos' });
    } else {
      res.json(results);
    }
  });
}); */

//fetch all todos by userId:
app.get('/todos', (req, res) => {
  const userId = req.query.userId;
  let query = 'SELECT * FROM todos WHERE userId=?';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Failed to fetch todos:', err);
      res.status(500).json({ error: 'Failed to fetch todos' });
    } else {
      res.json(results);
    }
  });
});

//fetch todo by id
app.get('/todos/:id', (req, res) => {
  const todoId = req.query.id;
  let query = 'SELECT * FROM todos WHERE todoId=?';
  connection.query(query, [todoId], (err, result) => {
    if (err) {
      console.error('Failed to fetch todo:', err);
      res.status(500).json({ error: 'Failed to fetch todo' });
    } else {
      res.json(result[0]);
    }
  });
});


// Create a new todo
app.post('/todos', (req, res) => {
  const { title, description } = req.body;
  const query = 'INSERT INTO todos (title, description) VALUES (?, ?)';
  connection.query(query, [title, description], (err, result) => {
    if (err) {
      console.error('Failed to create todo:', err);
      res.status(500).json({ error: 'Failed to create todo' });
    } else {
      res.status(201).json({ message: 'Todo created successfully' });
    }
  });
});

// Update a todo
app.put('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const { title, description } = req.body;
  const query = 'UPDATE todos SET title = ?, description = ? WHERE todo_id = ?';
  connection.query(query, [title, description, todoId], (err, result) => {
    if (err) {
      console.error('Failed to update todo:', err);
      res.status(500).json({ error: 'Failed to update todo' });
    } else {
      res.json({ message: 'Todo updated successfully' });
    }
  });
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const query = 'DELETE FROM todos WHERE todo_id = ?';
  connection.query(query, [todoId], (err, result) => {
    if (err) {
      console.error('Failed to delete todo:', err);
      res.status(500).json({ error: 'Failed to delete todo' });
    } else {
      res.json({ message: 'Todo deleted successfully' });
    }
  });
});

/* // Fetch all comments
app.get('/comments', (req, res) => {
  const query = 'SELECT * FROM comments';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch comments:', err);
      res.status(500).json({ error: 'Failed to fetch comments' });
    } else {
      res.json(results);
    }
  });
}); */

//fetch all comments by postId:
app.get('/comments', (req, res) => {
  const postId = req.query.postId;
  let query = 'SELECT * FROM comments WHERE postId=?';
  connection.query(query, [postId], (err, results) => {
    if (err) {
      console.error('Failed to fetch comments:', err);
      res.status(500).json({ error: 'Failed to fetch comments' });
    } else {
      res.json(results);
    }
  });
});

//fetch comment by id
app.get('/comments/:id', (req, res) => {
  const commentId = req.query.id;
  let query = 'SELECT * FROM comments WHERE commentId=?';
  connection.query(query, [commentId], (err, result) => {
    if (err) {
      console.error('Failed to fetch comment:', err);
      res.status(500).json({ error: 'Failed to fetch comment' });
    } else {
      res.json(result[0]);
    }
  });
});

// Create a new comment
app.post('/comments', (req, res) => {
  const { postId, content, userId } = req.body;
  const query = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
  const getUserQuery = 'SELECT * FROM users WHERE userId = ?';
  
  // Fetch user who posted the comment
  connection.query(getUserQuery, [userId], (err, result) => {
    if (err) {
      console.error('Failed to fetch user:', err);
      res.status(500).json({ error: 'Failed to fetch user' });
    } else {
      const user = result[0]; // Assuming there is only one user with a given userId
      
      // Create a new comment
      connection.query(query, [postId, userId, content], (err, result) => {
        if (err) {
          console.error('Failed to create comment:', err);
          res.status(500).json({ error: 'Failed to create comment' });
        } else {
          res.status(201).json({ user, message: 'Comment created successfully' });
        }
      });
    }
  });
});


// Update a comment
app.put('/comments/:id', (req, res) => {
  const commentId = req.params.id;
  const { postId, content } = req.body;
  const query = 'UPDATE comments SET post_id = ?, content = ? WHERE comment_id = ?';
  connection.query(query, [postId, content, commentId], (err, result) => {
    if (err) {
      console.error('Failed to update comment:', err);
      res.status(500).json({ error: 'Failed to update comment' });
    } else {
      res.json({ message: 'Comment updated successfully' });
    }
  });
});

// Delete a comment
app.delete('/comments/:id', (req, res) => {
  const commentId = req.params.id;
  const query = 'DELETE FROM comments WHERE comment_id = ?';
  connection.query(query, [commentId], (err, result) => {
    if (err) {
      console.error('Failed to delete comment:', err);
      res.status(500).json({ error: 'Failed to delete comment' });
    } else {
      res.json({ message: 'Comment deleted successfully' });
    }
  });
});




// Start the server

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
