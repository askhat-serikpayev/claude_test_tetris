import { useState } from 'react';
import { GameStats } from '../types';
import { scoreApi } from '../services/scoreApi';
import styles from './GameOverModal.module.css';

interface GameOverModalProps {
  stats: GameStats;
  onClose: () => void;
}

export function GameOverModal({ stats, onClose }: GameOverModalProps): JSX.Element {
  const [playerName, setPlayerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (): Promise<void> => {
    const name = playerName.trim();
    if (!name) return;

    setSubmitting(true);
    setError(null);
    try {
      await scoreApi.submitScore({
        playerName: name,
        score: stats.score,
        level: stats.level,
        linesCleared: stats.linesCleared,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit score');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Game Over</h2>
        <div className={styles.statsRow}>
          <span>Score: {stats.score.toLocaleString()}</span>
          <span>Level: {stats.level}</span>
          <span>Lines: {stats.linesCleared}</span>
        </div>

        {!submitted ? (
          <div className={styles.form}>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter your name"
              maxLength={50}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
              autoFocus
            />
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={submitting || !playerName.trim()}
            >
              {submitting ? 'Submitting...' : 'Submit Score'}
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        ) : (
          <p className={styles.success}>Score submitted!</p>
        )}

        <button className={styles.closeBtn} onClick={onClose}>
          {submitted ? 'Play Again (R)' : 'Skip & Play Again (R)'}
        </button>
      </div>
    </div>
  );
}
