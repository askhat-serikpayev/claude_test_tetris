import { useRef, useEffect } from 'react';
import { GameStats } from '../types';
import styles from './ScorePanel.module.css';

interface ScorePanelProps {
  stats: GameStats;
}

export function ScorePanel({ stats }: ScorePanelProps): JSX.Element {
  const scoreRef = useRef<HTMLSpanElement>(null);
  const prevScore = useRef(stats.score);

  useEffect(() => {
    if (stats.score !== prevScore.current && scoreRef.current) {
      scoreRef.current.classList.remove(styles.flash);
      void scoreRef.current.offsetWidth; // reflow
      scoreRef.current.classList.add(styles.flash);
      prevScore.current = stats.score;
    }
  }, [stats.score]);

  return (
    <div className={styles.panel}>
      <div className={styles.stat}>
        <span className={styles.label}>Score</span>
        <span ref={scoreRef} className={styles.value}>{stats.score.toLocaleString()}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Level</span>
        <span className={styles.value}>{stats.level}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Lines</span>
        <span className={styles.value}>{stats.linesCleared}</span>
      </div>
    </div>
  );
}
