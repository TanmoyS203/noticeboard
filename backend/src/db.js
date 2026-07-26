const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'notices.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS notices (
                                                id TEXT PRIMARY KEY,
                                                title TEXT NOT NULL,
                                                author TEXT NOT NULL,
                                                content TEXT NOT NULL,
                                                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
         )`,
        (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            }
        }
    );
});

module.exports = db;