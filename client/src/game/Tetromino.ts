import { TetrominoType, Position, ShapeMatrix, RotationDirection } from '../types';
import { TETROMINO_SHAPES, TETROMINO_COLORS } from './constants';

export class Tetromino {
  readonly type: TetrominoType;
  readonly color: string;
  position: Position;
  private rotationState: number;
  private shape: ShapeMatrix;

  constructor(type: TetrominoType) {
    this.type = type;
    this.color = TETROMINO_COLORS[type];
    this.rotationState = 0;
    this.shape = this.deepCopyMatrix(TETROMINO_SHAPES[type]);
    this.position = { row: 0, col: 0 };
  }

  getShape(): ShapeMatrix {
    return this.shape;
  }

  getRotationState(): number {
    return this.rotationState;
  }

  getSize(): number {
    return this.shape.length;
  }

  clone(): Tetromino {
    const copy = new Tetromino(this.type);
    copy.position = { ...this.position };
    copy.rotationState = this.rotationState;
    copy.shape = this.deepCopyMatrix(this.shape);
    return copy;
  }

  rotate(direction: RotationDirection): { previousState: number; newState: number } {
    const previousState = this.rotationState;

    if (this.type === TetrominoType.O) {
      return { previousState, newState: previousState };
    }

    if (direction === RotationDirection.Clockwise) {
      this.shape = this.rotateClockwise(this.shape);
      this.rotationState = (this.rotationState + 1) % 4;
    } else {
      this.shape = this.rotateCounterClockwise(this.shape);
      this.rotationState = (this.rotationState + 3) % 4;
    }

    return { previousState, newState: this.rotationState };
  }

  undoRotation(direction: RotationDirection): void {
    const reverseDir =
      direction === RotationDirection.Clockwise
        ? RotationDirection.CounterClockwise
        : RotationDirection.Clockwise;
    this.rotate(reverseDir);
  }

  private rotateClockwise(matrix: ShapeMatrix): ShapeMatrix {
    const size = matrix.length;
    const rotated: ShapeMatrix = Array.from({ length: size }, () => Array(size).fill(0) as number[]);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        rotated[c][size - 1 - r] = matrix[r][c];
      }
    }

    return rotated;
  }

  private rotateCounterClockwise(matrix: ShapeMatrix): ShapeMatrix {
    const size = matrix.length;
    const rotated: ShapeMatrix = Array.from({ length: size }, () => Array(size).fill(0) as number[]);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        rotated[size - 1 - c][r] = matrix[r][c];
      }
    }

    return rotated;
  }

  private deepCopyMatrix(matrix: ShapeMatrix): ShapeMatrix {
    return matrix.map((row) => [...row]);
  }
}
