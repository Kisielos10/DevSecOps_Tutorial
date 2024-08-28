const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const upload = multer({ dest: 'uploads/' });
const db = new sqlite3.Database(':memory:');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize the database
db.serialize(() => {
  db.run("CREATE TABLE users (username TEXT, password TEXT)");
  db.run("INSERT INTO users VALUES ('admin', 'secretpassword')");
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully');
});

app.get('/files', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      return res.status(500).send('Error reading upload directory');
    }
    res.json(files);
  });
});

let comments = [];

app.post('/comment', (req, res) => {
  const { name, comment } = req.body;
  comments.push({ name, comment });
  res.send('Comment added successfully');
});

app.get('/comments', (req, res) => {
  res.json(comments);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  db.get(query, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (row) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});