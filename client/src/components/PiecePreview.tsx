import { useRef, useEffect } from 'react';
import { TetrominoType } from '../types';
import { Renderer } from '../game';
import styles from './PiecePreview.module.css';

interface PiecePreviewProps {
  title: string;
  pieces: TetrominoType[];
}

const MINI_CELL = 18;
const CANVAS_SIZE = 80;

export function PiecePreview({ title, pieces }: PiecePreviewProps): JSX.Element {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    pieces.forEach((type, idx) => {
      const canvas = canvasRefs.current[idx];
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      Renderer.drawMiniPiece(ctx, type, MINI_CELL);
    });
  }, [pieces]);

  return (
    <div className={styles.container}>
      <span className={styles.title}>{title}</span>
      <div className={styles.pieces}>
        {pieces.map((_, idx) => (
          <canvas
            key={idx}
            ref={(el) => {
              canvasRefs.current[idx] = el;
            }}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className={styles.canvas}
          />
        ))}
      </div>
    </div>
  );
}
