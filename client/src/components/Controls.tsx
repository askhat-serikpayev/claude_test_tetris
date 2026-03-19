import styles from './Controls.module.css';

export function Controls(): JSX.Element {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Controls</h3>
      <ul className={styles.list}>
        <li><kbd>&larr;</kbd> / <kbd>A</kbd> Move Left</li>
        <li><kbd>&rarr;</kbd> / <kbd>D</kbd> Move Right</li>
        <li><kbd>&darr;</kbd> / <kbd>S</kbd> Soft Drop</li>
        <li><kbd>&uarr;</kbd> / <kbd>W</kbd> Rotate CW</li>
        <li><kbd>Z</kbd> Rotate CCW</li>
        <li><kbd>Space</kbd> Hard Drop</li>
        <li><kbd>C</kbd> / <kbd>Shift</kbd> Hold</li>
        <li><kbd>P</kbd> / <kbd>Esc</kbd> Pause</li>
        <li><kbd>R</kbd> Restart (game over)</li>
      </ul>
    </div>
  );
}
