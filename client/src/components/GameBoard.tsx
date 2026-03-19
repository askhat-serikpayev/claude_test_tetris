import { useRef, useEffect, useCallback, useState } from 'react';
import { GameEngine, GameSnapshot, Renderer, BOARD_ROWS, BOARD_COLS, CELL_SIZE } from '../game';
import { GameState } from '../types';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboard } from '../hooks/useKeyboard';

interface GameBoardProps {
  engine: GameEngine;
  onGameOver: (snapshot: GameSnapshot) => void;
}

export function GameBoard({ engine, onGameOver }: GameBoardProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const gameOverFiredRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    rendererRef.current = new Renderer(ctx);
  }, []);

  useEffect(() => {
    engine.setUpdateCallback((snap) => {
      setSnapshot(snap);
    });
  }, [engine]);

  useEffect(() => {
    if (snapshot?.state === GameState.GameOver && !gameOverFiredRef.current) {
      gameOverFiredRef.current = true;
      onGameOver(snapshot);
    }
    if (snapshot?.state === GameState.Playing) {
      gameOverFiredRef.current = false;
    }
  }, [snapshot, onGameOver]);

  const isPlaying = snapshot?.state === GameState.Playing;

  const tick = useCallback(
    (delta: number) => {
      engine.update(delta);
    },
    [engine],
  );

  useGameLoop(tick, isPlaying);
  useKeyboard(engine);

  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer || !snapshot) return;

    renderer.clear();
    renderer.drawBoard(snapshot.board.getGrid());

    if (snapshot.currentPiece) {
      renderer.drawGhost(snapshot.currentPiece, snapshot.ghostRow);
      renderer.drawPiece(snapshot.currentPiece);
    }

    if (snapshot.state === GameState.Paused) {
      renderer.drawOverlay('PAUSED');
    } else if (snapshot.state === GameState.GameOver) {
      renderer.drawOverlay('GAME OVER');
    }
  }, [snapshot]);

  return (
    <canvas
      ref={canvasRef}
      width={BOARD_COLS * CELL_SIZE}
      height={BOARD_ROWS * CELL_SIZE}
      style={{
        display: 'block',
        borderRadius: '6px',
        border: '1px solid rgba(0, 240, 255, 0.25)',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.15), 0 0 60px rgba(120, 0, 255, 0.1), inset 0 0 30px rgba(0, 0, 30, 0.5)',
      }}
    />
  );
}
