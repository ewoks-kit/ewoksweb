import styles from './Traceback.module.css';

interface Props {
  traceback: string;
}

function Traceback(props: Props) {
  const { traceback } = props;

  // The last line of the traceback is generally the error originally encountered
  const lastLine = traceback
    .split('\n')
    .reverse()
    .find((line) => line.trim() !== '');

  return (
    <div className={styles.container}>
      {lastLine && <span className={styles.excerpt}>{lastLine}</span>}
      <details>
        <summary className={styles.summary}>Show full traceback</summary>
        <pre className={styles.pre}>{traceback}</pre>
      </details>
    </div>
  );
}

export default Traceback;
