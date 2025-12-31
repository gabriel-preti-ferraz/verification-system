import Database from "better-sqlite3"
const db = new Database("database.db")

db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    )
    `).run()

db.prepare(`
    CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,

    status TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    days_left INTEGER NOT NULL,

    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
    )
    `).run()

export default db