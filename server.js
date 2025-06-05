const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const db = new sqlite3.Database('./data.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    db.run(
      `CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        unit TEXT NOT NULL,
        cost REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );
  }
});

// Endpoint to add new item
app.post('/api/items', (req, res) => {
  const { category, description, unit, cost } = req.body;
  if (!category || !description || !unit || !cost) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const stmt = db.prepare(
    'INSERT INTO items (category, description, unit, cost) VALUES (?, ?, ?, ?)'
  );
  stmt.run([category, description, unit, cost], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to add item' });
    }
    res.json({ id: this.lastID });
  });
});

// Endpoint to get last 5 items
app.get('/api/items', (req, res) => {
  db.all('SELECT * FROM items ORDER BY created_at DESC LIMIT 5', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve items' });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
