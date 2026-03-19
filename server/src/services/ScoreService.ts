import { DatabaseConnection } from '../config/database';
import { Score, ScoreRecord, CreateScoreData } from '../models/Score';
import { NotFoundError } from '../middleware/errorHandler';
import { APP_CONFIG } from '../config/app';

export class ScoreService {
  createScore(data: CreateScoreData): Score {
    const db = DatabaseConnection.getInstance();
    const stmt = db.prepare(
      'INSERT INTO scores (player_name, score, level, lines_cleared) VALUES (?, ?, ?, ?)',
    );
    const result = stmt.run(data.playerName, data.score, data.level, data.linesCleared);

    return this.getScoreById(Number(result.lastInsertRowid));
  }

  getScoreById(id: number): Score {
    const db = DatabaseConnection.getInstance();
    const row = db.prepare('SELECT * FROM scores WHERE id = ?').get(id) as ScoreRecord | undefined;

    if (!row) {
      throw new NotFoundError('Score');
    }

    return new Score(row);
  }

  getLeaderboard(): Score[] {
    const db = DatabaseConnection.getInstance();
    const rows = db
      .prepare('SELECT * FROM scores ORDER BY score DESC LIMIT ?')
      .all(APP_CONFIG.leaderboardLimit) as ScoreRecord[];

    return rows.map((row) => new Score(row));
  }

  deleteScore(id: number): void {
    const db = DatabaseConnection.getInstance();
    const result = db.prepare('DELETE FROM scores WHERE id = ?').run(id);

    if (result.changes === 0) {
      throw new NotFoundError('Score');
    }
  }
}
