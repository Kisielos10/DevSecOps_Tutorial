const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const serialize = require('node-serialize');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
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

app.get('/admin', (req, res) => {
  // Does not check anything
  res.send(`
    <h1>Admin Panel</h1>
    <p>Sensitive information: All user passwords are "password123"</p>
  `);
});

// Insecure deserialization 
app.post('/profile', (req, res) => {
  const userProfile = req.body.profile;
  const deserializedProfile = serialize.unserialize(userProfile);
  res.json(deserializedProfile);
});

app.get('/debug', (req, res) => {
  res.json({
    app_version: "1.0.0",
    environment: process.env.NODE_ENV || 'development',
    database: {
      type: "SQLite",
      name: "in-memory"
    },
    server: {
      platform: process.platform,
      architecture: process.arch,
      node_version: process.version
    }
  });
});

// Command Injection vulnerability
app.get('/ping', (req, res) => {
  const { host } = req.query;
  const cmd = `ping -c 4 ${host}`;
  require('child_process').exec(cmd, (error, stdout, stderr) => {
    res.send(stdout);
  });
});

// Weak Cryptography
app.post('/encrypt', (req, res) => {
  const { data } = req.body;
  
  // Using a static key
  const key = 'weakkey8'; // DES uses 64-bit (8-byte) keys

  // Using ECB mode by default
  const encrypted = CryptoJS.DES.encrypt(data, key).toString();
  
  res.json({ encrypted });
});

// Path Traversal vulnerability
app.get('/read-file', (req, res) => {
  const { filename } = req.query;
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading file');
    } else {
      res.send(data);
    }
  });
});

// Prototype Pollution
app.post('/merge', (req, res) => {
  const { target, source } = req.body;
  const merged = Object.assign({}, target, source);
  res.json(merged);
});

// XML External Entity (XXE) vulnerability
app.post('/parse-xml', (req, res) => {
  const { xml } = req.body;
  const libxmljs = require('libxmljs');
  const doc = libxmljs.parseXml(xml, { replaceEntities: true });
  res.send('XML parsed successfully');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app, server };