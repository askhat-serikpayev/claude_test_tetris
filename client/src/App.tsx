import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { GameEngine, GameSnapshot, SoundEngine } from './game';
import { GameState, GameStats, TetrominoType } from './types';
import type { GameEvent } from './game/GameEngine';
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
  const sound = useMemo(() => new SoundEngine(), []);
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [stats, setStats] = useState<GameStats>(EMPTY_STATS);
  const [holdPiece, setHoldPiece] = useState<TetrominoType[]>([]);
  const [nextPieces, setNextPieces] = useState<TetrominoType[]>([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameOverStats, setGameOverStats] = useState<GameStats>(EMPTY_STATS);
  const [muted, setMuted] = useState(false);
  const prevLevelRef = useRef(1);
  const musicStartedRef = useRef(false);

  const handleSoundEvent = useCallback(
    (event: GameEvent, level: number) => {
      switch (event) {
        case 'move':      sound.playMove(); break;
        case 'rotate':    sound.playRotate(); break;
        case 'hardDrop':  sound.playHardDrop(); break;
        case 'lineClear1': sound.playLineClear(1); break;
        case 'lineClear2': sound.playLineClear(2); break;
        case 'lineClear3': sound.playLineClear(3); break;
        case 'lineClear4': sound.playLineClear(4); break;
        case 'levelUp':   sound.playLevelUp(); break;
        case 'gameOver':  sound.playGameOver(); sound.stopMusic(); break;
        default: break;
      }
      prevLevelRef.current = level;
    },
    [sound],
  );

  useMemo(() => {
    engine.setUpdateCallback((snap: GameSnapshot) => {
      setStats(snap.stats);
      setGameState(snap.state);
      setHoldPiece(snap.holdPiece ? [snap.holdPiece] : []);
      setNextPieces(snap.nextPieces);
      if (snap.lastEvent !== 'none') {
        handleSoundEvent(snap.lastEvent, snap.stats.level);
      }
    });
  }, [engine, handleSoundEvent]);

  const handleStart = useCallback(() => {
    setShowGameOver(false);
    prevLevelRef.current = 1;
    engine.start();
    if (!musicStartedRef.current) {
      musicStartedRef.current = true;
      sound.startMusic();
    } else {
      sound.stopMusic();
      sound.startMusic();
    }
  }, [engine, sound]);

  const handleGameOver = useCallback((snap: GameSnapshot) => {
    setGameOverStats(snap.stats);
    setShowGameOver(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowGameOver(false);
    engine.start();
    sound.stopMusic();
    sound.startMusic();
  }, [engine, sound]);

  const handleMute = useCallback(() => {
    const nowMuted = sound.toggleMute();
    setMuted(nowMuted);
    if (!nowMuted && gameState === GameState.Playing) {
      sound.startMusic();
    }
  }, [sound, gameState]);

  // Keyboard mute shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.code === 'KeyM') handleMute();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleMute]);

  const boardWidth = 300;
  const boardHeight = 600;

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <h1 className={styles.title}>TETRIS</h1>
        <button
          className={`${styles.muteBtn} ${muted ? styles.mutedIcon : ''}`}
          onClick={handleMute}
          title={muted ? 'Unmute (M)' : 'Mute (M)'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <PiecePreview title="Hold" pieces={holdPiece} />
          <ScorePanel stats={stats} />
          <Controls />
        </div>

        <div className={styles.center}>
          {gameState === GameState.Idle ? (
            <div className={styles.startScreen} style={{ width: boardWidth, height: boardHeight }}>
              <p className={styles.startTitle}>Ready Player One</p>
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
