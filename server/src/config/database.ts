import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../data/tetris.db');

export class DatabaseConnection {
  private static instance: Database.Database | null = null;

  static getInstance(): Database.Database {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new Database(DB_PATH);
      DatabaseConnection.instance.pragma('journal_mode = WAL');
      DatabaseConnection.initialize(DatabaseConnection.instance);
    }
    return DatabaseConnection.instance;
  }

  private static initialize(db: Database.Database): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name TEXT NOT NULL,
        score INTEGER NOT NULL,
        level INTEGER NOT NULL,
        lines_cleared INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
  }

  static close(): void {
    if (DatabaseConnection.instance) {
      DatabaseConnection.instance.close();
      DatabaseConnection.instance = null;
    }
  }
}
