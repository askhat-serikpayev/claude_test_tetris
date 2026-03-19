import { TetrominoType } from '../types';
import { Tetromino } from './Tetromino';
import { BOARD_COLS } from './constants';

const ALL_TYPES: TetrominoType[] = [
  TetrominoType.I,
  TetrominoType.O,
  TetrominoType.T,
  TetrominoType.S,
  TetrominoType.Z,
  TetrominoType.J,
  TetrominoType.L,
];

export class PieceBag {
  private bag: TetrominoType[] = [];

  constructor() {
    this.refillBag();
  }

  next(): Tetromino {
    if (this.bag.length === 0) {
      this.refillBag();
    }

    const type = this.bag.pop()!;
    const piece = new Tetromino(type);
    piece.position = {
      row: -1,
      col: Math.floor((BOARD_COLS - piece.getSize()) / 2),
    };
    return piece;
  }

  peek(count: number): TetrominoType[] {
    while (this.bag.length < count) {
      this.prependBag();
    }

    return this.bag.slice(-count).reverse();
  }

  reset(): void {
    this.bag = [];
    this.refillBag();
  }

  private refillBag(): void {
    const shuffled = this.shuffle([...ALL_TYPES]);
    this.bag = shuffled;
  }

  private prependBag(): void {
    const shuffled = this.shuffle([...ALL_TYPES]);
    this.bag = [...shuffled, ...this.bag];
  }

  private shuffle(arr: TetrominoType[]): TetrominoType[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
