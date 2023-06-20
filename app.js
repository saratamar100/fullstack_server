const express = require("express");
const mysql = require("mysql2");
const util = require("util");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.argv[2],
  database: "fullstack6",
});

connection.connect((err) => {
  if (err) {
    console.error("Failed to connect to the MySQL server:", err);
    return;
  }
  console.log("Connected to the MySQL server");
});


app.get("/users", (req, res) => {
  let query = "SELECT * FROM users WHERE username = ?";
  let username = req.query.username;
  if(!username){
    username = "a";
    query = "SELECT * FROM users WHERE 'a' = ?";
  }
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error("Failed to fetch users:", err);
      res.status(500).json({ error: "Failed to fetch users" });
    } else {
      console.log(results);
      res.json(
        results.map((user) => ({
          username: user.username,
          email: user.email,
          password: user.password,
          id: user.user_id,
          name: user.name,
          city: user.city,
        }))
      );
    }
  });
});

//fetch user by id
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  let query = "SELECT * FROM users WHERE user_id=?";
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Failed to fetch user:", err);
      res.status(500).json({ error: "Failed to fetch user" });
    } else if (result.length > 0) {
      const { user_id, username, password, email, city, name } = result[0];
      res.json({ id: user_id, username, password, email, city, name });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

// Create a new user
app.post("/users", (req, res) => {
  const { username, password, name, email, city } = req.body;
  const query =
    "INSERT INTO users (username, password, name, email, city) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    query,
    [username, password, name, email, city],
    (err, result) => {
      if (err) {
        console.error("Failed to create user:", err);
        res.status(500).json({ error: "Failed to create user" });
      } else {
        res
          .status(201)
          .json({ username, password, name, email, city, id: result.insertId });
      }
    }
  );
});

// Update a user
app.put("/users/:id", (req, res) => {
  //////////////////?
  const userId = req.params.id;
  const { username, password, name, email, city } = req.body;
  const query =
    "UPDATE users SET username = ?, password = ?, name= ?, email= ?, city=? WHERE user_id = ?";
  connection.query(
    query,
    [username, password, name, email, city, userId],
    (err, result) => {
      if (err) {
        console.error("Failed to update user:", err);
        res.status(500).json({ error: "Failed to update user" });
      } else {
        res.json({ username, password, name, email, city, userId });
      }
    }
  );
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Get all this user's posts
    const postsQuery = "SELECT * FROM posts WHERE user_id=?";
    const postsResult = await util.promisify(connection.query).bind(connection)(
      postsQuery,
      [userId]
    );
    const postIds = postsResult.map((post) => post.post_id);

    // Delete all comments for each post
    for (let i = 0; i < postIds.length; i++) {
      const postId = postIds[i];
      const commentQuery = "DELETE FROM comments WHERE post_id = ?";
      await util.promisify(connection.query).bind(connection)(commentQuery, [
        postId,
      ]);
    }

    // Delete all posts of this user
    const postQuery = "DELETE FROM posts WHERE user_id = ?";
    await util.promisify(connection.query).bind(connection)(postQuery, [
      userId,
    ]);

    // Delete all todos of this user
    const todosQuery = "DELETE FROM todos WHERE user_id = ?";
    await util.promisify(connection.query).bind(connection)(todosQuery, [
      userId,
    ]);

    // Finally, delete the user
    const deleteQuery = "DELETE FROM users WHERE user_id = ?";
    await util.promisify(connection.query).bind(connection)(deleteQuery, [
      userId,
    ]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Failed to delete user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

//fetch all posts by userId:
app.get("/posts", (req, res) => {
  const userId = req.query.userId;
  let query = "SELECT * FROM posts WHERE user_id=?";
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Failed to fetch posts:", err);
      res.status(500).json({ error: "Failed to fetch posts" });
    } else {
      res.json(
        results.map((post) => ({
          id: post.post_id,
          userId: post.user_id,
          title: post.post_title,
          body: post.post_content,
        }))
      );
    }
  });
});

//fetch post by id
app.get("/posts/:id", (req, res) => {
  const postId = req.params.id;
  let query = "SELECT * FROM posts WHERE post_id=?";
  connection.query(query, [postId], (err, result) => {
    if (err) {
      console.error("Failed to fetch post:", err);
      res.status(500).json({ error: "Failed to fetch post" });
    } else if (result.length > 0) {
      const { post_id, user_id, post_title, post_content } = result[0];
      res.json({
        id: post_id,
        userId: user_id,
        title: post_title,
        body: post_content,
      });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  });
});

// Create a new post
app.post("/posts", (req, res) => {
  const { title, body, userId } = req.body;
  console.log(req.body);
  const query =
    "INSERT INTO posts (post_title, post_content, user_id) VALUES (?, ?, ?)";
  connection.query(query, [title, body, userId], (err, result) => {
    if (err) {
      console.error("Failed to create post:", err);
      res.status(500).json({ error: "Failed to create post" });
    } else {
      res.status(201).json({ title, body, userId, id: result.insertId });
    }
  });
});

// Update a post
app.put("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const { title, body, userId } = req.body;
  const query =
    "UPDATE posts SET post_title = ?, post_content = ?, user_id = ? WHERE post_id = ?";
  connection.query(query, [title, body, userId, postId], (err, result) => {
    if (err) {
      console.error("Failed to update post:", err);
      res.status(500).json({ error: "Failed to update post" });
    } else {
      res.json({ title, body, userId, postId });
    }
  });
});

// Delete a post
app.delete("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    // Delete all comments on this post
    const commentQuery = "DELETE FROM comments WHERE post_id = ?";
    await util.promisify(connection.query).bind(connection)(commentQuery, [
      postId,
    ]);

    // Delete the post
    const query = "DELETE FROM posts WHERE post_id = ?";
    await util.promisify(connection.query).bind(connection)(query, [postId]);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Failed to delete post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

//fetch all todos by userId:
app.get("/todos", (req, res) => {
  const userId = req.query.userId;
  let query = "SELECT * FROM todos WHERE user_id=?";
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Failed to fetch todos:", err);
      res.status(500).json({ error: "Failed to fetch todos" });
    } else {
      res.json(
        results.map((todo) => ({
          id: todo.todo_id,
          userId: todo.user_id,
          title: todo.todo_description,
          completed: todo.todo_status == "completed",
        }))
      );
    }
  });
});

//fetch todo by id
app.get("/todos/:id", (req, res) => {
  const todoId = req.params.id;
  let query = "SELECT * FROM todos WHERE todo_id=?";
  connection.query(query, [todoId], (err, result) => {
    if (err) {
      console.error("Failed to fetch todo:", err);
      res.status(500).json({ error: "Failed to fetch todo" });
    } else if (result.length > 0) {
      const { todo_id, user_id, todo_description, todo_status } = result[0];
      res.json({
        id: todo_id,
        userId: user_id,
        title: todo_description,
        completed: todo_status == "completed",
      });
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  });
});

// Create a new todo
app.post("/todos", (req, res) => {
  /////////////////?
  const { title, userId } = req.body;
  const query =
    "INSERT INTO todos (user_id, todo_description, todo_status) VALUES (?, ?, 'pending')";
  connection.query(query, [userId, title], (err, result) => {
    if (err) {
      console.error("Failed to create todo:", err);
      res.status(500).json({ error: "Failed to create todo" });
    } else {
      res
        .status(201)
        .json({ title, userId, completed: false, id: result.insertId });
    }
  });
});

// Update a todo
app.put("/todos/:id", (req, res) => {
  const todoId = req.params.id;
  const { title, userId, completed } = req.body;
  const query =
    "UPDATE todos SET todo_description = ?, user_id =?, todo_status = ? WHERE todo_id = ?";
  connection.query(
    query,
    [title, userId, completed ? "completed" : "pending", todoId],
    (err, result) => {
      if (err) {
        console.error("Failed to update todo:", err);
        res.status(500).json({ error: "Failed to update todo" });
      } else {
        res.json({ title, userId, completed, id: todoId });
      }
    }
  );
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const todoId = req.params.id;
  const query = "DELETE FROM todos WHERE todo_id = ?";
  connection.query(query, [todoId], (err, result) => {
    if (err) {
      console.error("Failed to delete todo:", err);
      res.status(500).json({ error: "Failed to delete todo" });
    } else {
      res.json({ message: "Todo deleted successfully" });
    }
  });
});

//fetch all comments by postId:
app.get("/comments", (req, res) => {
  const postId = req.query.postId;
  let query =
    "SELECT comment_id, comment_content, post_id, username, email FROM comments NATURAL JOIN users WHERE post_id=?";
  connection.query(query, [postId], (err, results) => {
    if (err) {
      console.error("Failed to fetch comments:", err);
      res.status(500).json({ error: "Failed to fetch comments" });
    } else {
      res.json(
        results.map((c) => ({
          id: c.comment_id,
          postId: c.post_id,
          body: c.comment_content,
          name: c.name,
          email: c.eamil,
        }))
      );
    }
  });
});

//fetch comment by id
app.get("/comments/:id", (req, res) => {
  const commentId = req.params.id;
  let query =
    "SELECT comment_id, comment_content, post_id, username, email FROM comments NATURAL JOIN users WHERE comment_id=?";
  connection.query(query, [commentId], (err, result) => {
    if (err) {
      console.error("Failed to fetch comment:", err);
      res.status(500).json({ error: "Failed to fetch comment" });
    } else if (result.length > 0) {
      const { post_id, comment_content, name, eamil } = result[0];
      res.json({
        id: commentId,
        postId: post_id,
        body: comment_content,
        name: name,
        email: eamil,
      });
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  });
});

// Create a new comment
app.post("/comments", async (req, res) => {
  try {
    const { postId, body, userId } = req.body;
    const query =
      "INSERT INTO comments (post_id, user_id, comment_content) VALUES (?, ?, ?)";
    const getUserQuery = "SELECT * FROM users WHERE user_id = ?";

    // Fetch user who posted the comment
    const [userResult] = await util
      .promisify(connection.query)
      .bind(connection)(getUserQuery, [userId]);
    const user = userResult; // Assuming there is only one user with a given userId

    // Insert the comment
    const result = await util.promisify(connection.query).bind(connection)(
      query,
      [postId, userId, body]
    );

    res.status(201).json({
      id: result.insertId,
      postId,
      name: user.name,
      email: user.email,
      body,
    });
  } catch (error) {
    console.error("Failed to create comment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// Update a comment
app.put("/comments/:id", (req, res) => {
  const commentId = req.params.id;
  const { postId, body } = req.body;
  const query =
    "UPDATE comments SET post_id = ?, comment_content = ? WHERE comment_id = ?";
  connection.query(query, [postId, body, commentId], (err, result) => {
    if (err) {
      console.error("Failed to update comment:", err);
      res.status(500).json({ error: "Failed to update comment" });
    } else {
      res.json(req.body);
    }
  });
});

// Delete a comment
app.delete("/comments/:id", (req, res) => {
  const commentId = req.params.id;
  const query = "DELETE FROM comments WHERE comment_id = ?";
  connection.query(query, [commentId], (err, result) => {
    if (err) {
      console.error("Failed to delete comment:", err);
      res.status(500).json({ error: "Failed to delete comment" });
    } else {
      res.json({ message: "Comment deleted successfully" });
    }
  });
});

// Start the server

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
