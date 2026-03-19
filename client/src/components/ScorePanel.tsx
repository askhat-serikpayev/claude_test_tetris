import { GameStats } from '../types';
import styles from './ScorePanel.module.css';

interface ScorePanelProps {
  stats: GameStats;
}

export function ScorePanel({ stats }: ScorePanelProps): JSX.Element {
  return (
    <div className={styles.panel}>
      <div className={styles.stat}>
        <span className={styles.label}>Score</span>
        <span className={styles.value}>{stats.score.toLocaleString()}</span>
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
