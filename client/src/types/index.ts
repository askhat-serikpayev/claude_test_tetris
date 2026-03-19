export enum TetrominoType {
  I = 'I',
  O = 'O',
  T = 'T',
  S = 'S',
  Z = 'Z',
  J = 'J',
  L = 'L',
}

export enum Direction {
  Left = 'left',
  Right = 'right',
  Down = 'down',
}

export enum RotationDirection {
  Clockwise = 'cw',
  CounterClockwise = 'ccw',
}

export enum GameState {
  Idle = 'idle',
  Playing = 'playing',
  Paused = 'paused',
  GameOver = 'gameover',
}

export interface Position {
  row: number;
  col: number;
}

export interface GameStats {
  score: number;
  level: number;
  linesCleared: number;
}

export interface CellColor {
  filled: boolean;
  color: string;
}

export interface ScoreEntry {
  id: number;
  playerName: string;
  score: number;
  level: number;
  linesCleared: number;
  createdAt: string;
}

export type BoardGrid = CellColor[][];

export type ShapeMatrix = number[][];
