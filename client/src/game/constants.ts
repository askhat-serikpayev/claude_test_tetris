import { TetrominoType, ShapeMatrix } from '../types';

export const BOARD_ROWS = 20;
export const BOARD_COLS = 10;
export const CELL_SIZE = 30;

export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  [TetrominoType.I]: '#00f0f0',
  [TetrominoType.O]: '#f0f000',
  [TetrominoType.T]: '#a000f0',
  [TetrominoType.S]: '#00f000',
  [TetrominoType.Z]: '#f00000',
  [TetrominoType.J]: '#0000f0',
  [TetrominoType.L]: '#f0a000',
};

export const TETROMINO_SHAPES: Record<TetrominoType, ShapeMatrix> = {
  [TetrominoType.I]: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [TetrominoType.O]: [
    [1, 1],
    [1, 1],
  ],
  [TetrominoType.T]: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [TetrominoType.S]: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [TetrominoType.Z]: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  [TetrominoType.J]: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [TetrominoType.L]: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

export const LINE_SCORES = [0, 100, 300, 500, 800];

export const LINES_PER_LEVEL = 10;

export const BASE_DROP_INTERVAL_MS = 1000;
export const MIN_DROP_INTERVAL_MS = 50;
export const SPEED_FACTOR = 0.85;

// SRS wall kick data
// [rotation_from][rotation_to] -> array of (col_offset, row_offset) tests
type WallKickTable = Record<string, [number, number][]>;

export const SRS_WALL_KICKS: WallKickTable = {
  '0>1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '1>0': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '1>2': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '2>1': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '2>3': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '3>2': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '3>0': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '0>3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
};

export const SRS_WALL_KICKS_I: WallKickTable = {
  '0>1': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  '1>0': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  '1>2': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
  '2>1': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  '2>3': [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  '3>2': [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  '3>0': [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
  '0>3': [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
};
