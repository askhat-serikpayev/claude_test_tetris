import { BoardGrid, TetrominoType, CellColor } from '../types';
import { BOARD_ROWS, BOARD_COLS, CELL_SIZE, TETROMINO_COLORS, TETROMINO_SHAPES } from './constants';
import { Tetromino } from './Tetromino';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private readonly width: number;
  private readonly height: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.width = BOARD_COLS * CELL_SIZE;
    this.height = BOARD_ROWS * CELL_SIZE;
  }

  clear(): void {
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.drawGridLines();
  }

  drawBoard(grid: BoardGrid): void {
    for (let r = 0; r < BOARD_ROWS; r++) {
      for (let c = 0; c < BOARD_COLS; c++) {
        const cell = grid[r][c];
        if (cell.filled) {
          this.drawCell(r, c, cell.color);
        }
      }
    }
  }

  drawPiece(piece: Tetromino): void {
    const shape = piece.getShape();
    const { row, col } = piece.position;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 0) continue;
        const boardRow = row + r;
        if (boardRow < 0) continue;
        this.drawCell(boardRow, col + c, piece.color);
      }
    }
  }

  drawGhost(piece: Tetromino, ghostRow: number): void {
    const shape = piece.getShape();

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 0) continue;
        const boardRow = ghostRow + r;
        if (boardRow < 0) continue;
        this.drawGhostCell(boardRow, piece.position.col + c, piece.color);
      }
    }
  }

  drawOverlay(text: string): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 24px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, this.width / 2, this.height / 2);
  }

  static drawMiniPiece(
    ctx: CanvasRenderingContext2D,
    type: TetrominoType,
    cellSize: number,
  ): void {
    const shape = TETROMINO_SHAPES[type];
    const color = TETROMINO_COLORS[type];

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const rows = shape.length;
    const cols = shape[0].length;
    const offsetX = (ctx.canvas.width - cols * cellSize) / 2;
    const offsetY = (ctx.canvas.height - rows * cellSize) / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (shape[r][c] === 0) continue;
        Renderer.drawStaticCell(ctx, offsetY + r * cellSize, offsetX + c * cellSize, cellSize, color);
      }
    }
  }

  private drawCell(row: number, col: number, color: string): void {
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.fillRect(x + 1, y + 1, CELL_SIZE - 2, 3);
    this.ctx.fillRect(x + 1, y + 1, 3, CELL_SIZE - 2);

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fillRect(x + 1, y + CELL_SIZE - 4, CELL_SIZE - 2, 3);
    this.ctx.fillRect(x + CELL_SIZE - 4, y + 1, 3, CELL_SIZE - 2);
  }

  private drawGhostCell(row: number, col: number, color: string): void {
    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = 0.3;
    this.ctx.strokeRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4);
    this.ctx.globalAlpha = 1;
  }

  private drawGridLines(): void {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;

    for (let r = 0; r <= BOARD_ROWS; r++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, r * CELL_SIZE);
      this.ctx.lineTo(this.width, r * CELL_SIZE);
      this.ctx.stroke();
    }

    for (let c = 0; c <= BOARD_COLS; c++) {
      this.ctx.beginPath();
      this.ctx.moveTo(c * CELL_SIZE, 0);
      this.ctx.lineTo(c * CELL_SIZE, this.height);
      this.ctx.stroke();
    }
  }

  private static drawStaticCell(
    ctx: CanvasRenderingContext2D,
    y: number,
    x: number,
    size: number,
    color: string,
  ): void {
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
  }
}
