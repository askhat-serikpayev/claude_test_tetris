import {
  GameState,
  GameStats,
  Direction,
  RotationDirection,
  TetrominoType,
} from '../types';
import { Board } from './Board';
import { Tetromino } from './Tetromino';
import { PieceBag } from './PieceBag';
import {
  LINE_SCORES,
  LINES_PER_LEVEL,
  BASE_DROP_INTERVAL_MS,
  MIN_DROP_INTERVAL_MS,
  SPEED_FACTOR,
  SRS_WALL_KICKS,
  SRS_WALL_KICKS_I,
} from './constants';

export interface GameSnapshot {
  board: Board;
  currentPiece: Tetromino | null;
  ghostRow: number;
  holdPiece: TetrominoType | null;
  nextPieces: TetrominoType[];
  stats: GameStats;
  state: GameState;
}

export type GameEventCallback = (snapshot: GameSnapshot) => void;

export class GameEngine {
  private board: Board;
  private pieceBag: PieceBag;
  private currentPiece: Tetromino | null = null;
  private holdType: TetrominoType | null = null;
  private holdUsed = false;
  private state: GameState = GameState.Idle;
  private stats: GameStats = { score: 0, level: 1, linesCleared: 0 };
  private dropTimer = 0;
  private onUpdate: GameEventCallback | null = null;

  constructor() {
    this.board = new Board();
    this.pieceBag = new PieceBag();
  }

  setUpdateCallback(cb: GameEventCallback): void {
    this.onUpdate = cb;
  }

  start(): void {
    this.board.reset();
    this.pieceBag.reset();
    this.currentPiece = null;
    this.holdType = null;
    this.holdUsed = false;
    this.stats = { score: 0, level: 1, linesCleared: 0 };
    this.dropTimer = 0;
    this.state = GameState.Playing;
    this.spawnPiece();
    this.emitUpdate();
  }

  pause(): void {
    if (this.state === GameState.Playing) {
      this.state = GameState.Paused;
      this.emitUpdate();
    }
  }

  resume(): void {
    if (this.state === GameState.Paused) {
      this.state = GameState.Playing;
      this.emitUpdate();
    }
  }

  togglePause(): void {
    if (this.state === GameState.Playing) {
      this.pause();
    } else if (this.state === GameState.Paused) {
      this.resume();
    }
  }

  getState(): GameState {
    return this.state;
  }

  getStats(): GameStats {
    return { ...this.stats };
  }

  getSnapshot(): GameSnapshot {
    return {
      board: this.board,
      currentPiece: this.currentPiece,
      ghostRow: this.currentPiece ? this.board.getGhostPosition(this.currentPiece) : 0,
      holdPiece: this.holdType,
      nextPieces: this.pieceBag.peek(3),
      stats: { ...this.stats },
      state: this.state,
    };
  }

  update(deltaMs: number): void {
    if (this.state !== GameState.Playing || !this.currentPiece) return;

    this.dropTimer += deltaMs;
    const interval = this.getDropInterval();

    if (this.dropTimer >= interval) {
      this.dropTimer -= interval;
      this.moveDown();
    }
  }

  move(direction: Direction): void {
    if (this.state !== GameState.Playing || !this.currentPiece) return;

    const piece = this.currentPiece;

    switch (direction) {
      case Direction.Left:
        piece.position.col--;
        if (!this.board.isValidPosition(piece)) piece.position.col++;
        break;
      case Direction.Right:
        piece.position.col++;
        if (!this.board.isValidPosition(piece)) piece.position.col--;
        break;
      case Direction.Down:
        this.moveDown();
        break;
    }

    this.emitUpdate();
  }

  rotate(direction: RotationDirection): void {
    if (this.state !== GameState.Playing || !this.currentPiece) return;

    const piece = this.currentPiece;
    const { previousState, newState } = piece.rotate(direction);

    if (previousState === newState) return; // O-piece

    const kicks = this.getWallKicks(piece, previousState, newState);

    for (const [colOffset, rowOffset] of kicks) {
      piece.position.col += colOffset;
      piece.position.row -= rowOffset;

      if (this.board.isValidPosition(piece)) {
        this.emitUpdate();
        return;
      }

      piece.position.col -= colOffset;
      piece.position.row += rowOffset;
    }

    piece.undoRotation(direction);
    this.emitUpdate();
  }

  hardDrop(): void {
    if (this.state !== GameState.Playing || !this.currentPiece) return;

    const ghostRow = this.board.getGhostPosition(this.currentPiece);
    const cellsDropped = ghostRow - this.currentPiece.position.row;
    this.stats.score += cellsDropped * 2;
    this.currentPiece.position.row = ghostRow;
    this.lockAndAdvance();
  }

  hold(): void {
    if (this.state !== GameState.Playing || !this.currentPiece || this.holdUsed) return;

    const currentType = this.currentPiece.type;

    if (this.holdType) {
      const swapPiece = new Tetromino(this.holdType);
      swapPiece.position = {
        row: -1,
        col: Math.floor((10 - swapPiece.getSize()) / 2),
      };
      this.holdType = currentType;
      this.currentPiece = swapPiece;
    } else {
      this.holdType = currentType;
      this.spawnPiece();
    }

    this.holdUsed = true;
    this.emitUpdate();
  }

  private moveDown(): void {
    if (!this.currentPiece) return;

    this.currentPiece.position.row++;

    if (!this.board.isValidPosition(this.currentPiece)) {
      this.currentPiece.position.row--;
      this.lockAndAdvance();
      return;
    }

    this.emitUpdate();
  }

  private lockAndAdvance(): void {
    if (!this.currentPiece) return;

    this.board.lockPiece(this.currentPiece);
    const linesCleared = this.board.clearFullLines();
    this.updateStats(linesCleared);
    this.holdUsed = false;
    this.dropTimer = 0;
    this.spawnPiece();
    this.emitUpdate();
  }

  private spawnPiece(): void {
    this.currentPiece = this.pieceBag.next();

    if (!this.board.isValidPosition(this.currentPiece)) {
      this.state = GameState.GameOver;
      this.currentPiece = null;
    }
  }

  private updateStats(linesCleared: number): void {
    if (linesCleared > 0 && linesCleared <= 4) {
      this.stats.score += LINE_SCORES[linesCleared] * this.stats.level;
      this.stats.linesCleared += linesCleared;
      this.stats.level = Math.floor(this.stats.linesCleared / LINES_PER_LEVEL) + 1;
    }
  }

  private getDropInterval(): number {
    const interval = BASE_DROP_INTERVAL_MS * Math.pow(SPEED_FACTOR, this.stats.level - 1);
    return Math.max(interval, MIN_DROP_INTERVAL_MS);
  }

  private getWallKicks(
    piece: Tetromino,
    fromState: number,
    toState: number,
  ): [number, number][] {
    const key = `${fromState}>${toState}`;
    const table = piece.type === 'I' ? SRS_WALL_KICKS_I : SRS_WALL_KICKS;
    return table[key] ?? [[0, 0]];
  }

  private emitUpdate(): void {
    if (this.onUpdate) {
      this.onUpdate(this.getSnapshot());
    }
  }
}
