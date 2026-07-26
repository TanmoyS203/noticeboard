require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const PORT = process.env.PORT;

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'x-admin-password'],
    })
);

app.use(express.json());

// 1. GET ALL NOTICES
app.get('/api/notices', (req, res) => {
    db.all('SELECT * FROM notices ORDER BY timestamp DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. CREATE A NOTICE
app.post('/api/notices', (req, res) => {
    const { id, title, author, content, adminPass } = req.body;

    if (adminPass !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized: Invalid admin password' });
    }

    if (!title || !author || !content) {
        return res.status(400).json({ error: 'Missing required notice fields' });
    }

    const query = `INSERT INTO notices (id, title, author, content) VALUES (?, ?, ?, ?)`;
    db.run(query, [id, title, author, content], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id, title, author, content, timestamp: new Date() });
    });
});

// 3. DELETE A NOTICE
app.delete('/api/notices/:id', (req, res) => {
    const { id } = req.params;
    const adminPass = req.headers['x-admin-password'];

    if (adminPass !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized: Invalid admin password' });
    }

    db.run('DELETE FROM notices WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Notice deleted successfully' });
    });
});

// Keep process active and listening
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Prevent Node process from exiting automatically
process.stdin.resume();

// Optional: Log errors if something unhandled crashes the process
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});