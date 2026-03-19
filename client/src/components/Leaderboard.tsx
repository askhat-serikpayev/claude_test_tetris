import { useState, useEffect, useCallback } from 'react';
import { ScoreEntry } from '../types';
import { scoreApi } from '../services/scoreApi';
import styles from './Leaderboard.module.css';

export function Leaderboard(): JSX.Element {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scoreApi.getLeaderboard();
      setScores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Leaderboard</h2>
      {loading && <p className={styles.message}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && scores.length === 0 && (
        <p className={styles.message}>No scores yet</p>
      )}
      {scores.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Score</th>
              <th>Level</th>
              <th>Lines</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, idx) => (
              <tr key={s.id}>
                <td>{idx + 1}</td>
                <td>{s.playerName}</td>
                <td>{s.score.toLocaleString()}</td>
                <td>{s.level}</td>
                <td>{s.linesCleared}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className={styles.refresh} onClick={fetchScores} disabled={loading}>
        Refresh
      </button>
    </div>
  );
}
