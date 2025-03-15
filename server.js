const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./timers.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS timers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    readingTime INTEGER,
    examTime INTEGER
)`);

// API Routes
app.get('/timers', (req, res) => {
    db.all('SELECT * FROM timers', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/timers', (req, res) => {
    const { title, readingTime, examTime } = req.body;
    db.run('INSERT INTO timers (title, readingTime, examTime) VALUES (?, ?, ?)',
        [title, readingTime, examTime], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, title, readingTime, examTime });
        }
    );
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});