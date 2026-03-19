import { useState, useMemo, useCallback } from 'react';
import { GameEngine, GameSnapshot } from './game';
import { GameState, GameStats, TetrominoType } from './types';
import { GameBoard } from './components/GameBoard';
import { ScorePanel } from './components/ScorePanel';
import { PiecePreview } from './components/PiecePreview';
import { Leaderboard } from './components/Leaderboard';
import { GameOverModal } from './components/GameOverModal';
import { Controls } from './components/Controls';
import styles from './App.module.css';

const EMPTY_STATS: GameStats = { score: 0, level: 1, linesCleared: 0 };

export default function App(): JSX.Element {
  const engine = useMemo(() => new GameEngine(), []);
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [stats, setStats] = useState<GameStats>(EMPTY_STATS);
  const [holdPiece, setHoldPiece] = useState<TetrominoType[]>([]);
  const [nextPieces, setNextPieces] = useState<TetrominoType[]>([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameOverStats, setGameOverStats] = useState<GameStats>(EMPTY_STATS);

  useMemo(() => {
    engine.setUpdateCallback((snap: GameSnapshot) => {
      setStats(snap.stats);
      setGameState(snap.state);
      setHoldPiece(snap.holdPiece ? [snap.holdPiece] : []);
      setNextPieces(snap.nextPieces);
    });
  }, [engine]);

  const handleStart = useCallback(() => {
    setShowGameOver(false);
    engine.start();
  }, [engine]);

  const handleGameOver = useCallback((snap: GameSnapshot) => {
    setGameOverStats(snap.stats);
    setShowGameOver(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowGameOver(false);
    engine.start();
  }, [engine]);

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>TETRIS</h1>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          {holdPiece.length > 0 && <PiecePreview title="Hold" pieces={holdPiece} />}
          <ScorePanel stats={stats} />
          <Controls />
        </div>

        <div className={styles.center}>
          {gameState === GameState.Idle ? (
            <div className={styles.startScreen}>
              <button className={styles.startBtn} onClick={handleStart}>
                Start Game
              </button>
            </div>
          ) : (
            <GameBoard engine={engine} onGameOver={handleGameOver} />
          )}
        </div>

        <div className={styles.sidebar}>
          <PiecePreview title="Next" pieces={nextPieces} />
          <Leaderboard />
        </div>
      </div>

      {showGameOver && (
        <GameOverModal stats={gameOverStats} onClose={handleCloseModal} />
      )}
    </div>
  );
}
