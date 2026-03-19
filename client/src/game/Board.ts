import { BoardGrid, CellColor } from '../types';
import { BOARD_ROWS, BOARD_COLS } from './constants';
import { Tetromino } from './Tetromino';

export class Board {
  private grid: BoardGrid;

  constructor() {
    this.grid = this.createEmptyGrid();
  }

  getGrid(): BoardGrid {
    return this.grid;
  }

  reset(): void {
    this.grid = this.createEmptyGrid();
  }

  isValidPosition(piece: Tetromino): boolean {
    const shape = piece.getShape();
    const { row, col } = piece.position;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 0) continue;

        const boardRow = row + r;
        const boardCol = col + c;

        if (boardCol < 0 || boardCol >= BOARD_COLS || boardRow >= BOARD_ROWS) {
          return false;
        }

        if (boardRow < 0) continue;

        if (this.grid[boardRow][boardCol].filled) {
          return false;
        }
      }
    }

    return true;
  }

  lockPiece(piece: Tetromino): void {
    const shape = piece.getShape();
    const { row, col } = piece.position;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 0) continue;

        const boardRow = row + r;
        const boardCol = col + c;

        if (boardRow >= 0 && boardRow < BOARD_ROWS && boardCol >= 0 && boardCol < BOARD_COLS) {
          this.grid[boardRow][boardCol] = { filled: true, color: piece.color };
        }
      }
    }
  }

  clearFullLines(): number {
    const fullRows: number[] = [];

    for (let r = 0; r < BOARD_ROWS; r++) {
      if (this.grid[r].every((cell) => cell.filled)) {
        fullRows.push(r);
      }
    }

    for (const row of fullRows.reverse()) {
      this.grid.splice(row, 1);
      this.grid.unshift(this.createEmptyRow());
    }

    return fullRows.length;
  }

  getGhostPosition(piece: Tetromino): number {
    let ghostRow = piece.position.row;
    const testPiece = piece.clone();

    while (true) {
      testPiece.position = { row: ghostRow + 1, col: piece.position.col };
      if (!this.isValidPosition(testPiece)) break;
      ghostRow++;
    }

    return ghostRow;
  }

  private createEmptyGrid(): BoardGrid {
    return Array.from({ length: BOARD_ROWS }, () => this.createEmptyRow());
  }

  private createEmptyRow(): CellColor[] {
    return Array.from({ length: BOARD_COLS }, () => ({ filled: false, color: '' }));
  }
}
