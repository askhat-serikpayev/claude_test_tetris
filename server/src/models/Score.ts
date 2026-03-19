export interface ScoreRecord {
  id: number;
  player_name: string;
  score: number;
  level: number;
  lines_cleared: number;
  created_at: string;
}

export interface CreateScoreData {
  playerName: string;
  score: number;
  level: number;
  linesCleared: number;
}

export class Score {
  readonly id: number;
  readonly playerName: string;
  readonly score: number;
  readonly level: number;
  readonly linesCleared: number;
  readonly createdAt: string;

  constructor(record: ScoreRecord) {
    this.id = record.id;
    this.playerName = record.player_name;
    this.score = record.score;
    this.level = record.level;
    this.linesCleared = record.lines_cleared;
    this.createdAt = record.created_at;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      playerName: this.playerName,
      score: this.score,
      level: this.level,
      linesCleared: this.linesCleared,
      createdAt: this.createdAt,
    };
  }
}
