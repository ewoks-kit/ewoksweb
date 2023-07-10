import styles from './WorkflowItem.module.css';

interface Props {
  traceback: string;
}

function Traceback(props: Props) {
  const { traceback } = props;
  return (
    <details className={styles.traceback}>
      <summary>Traceback</summary>
      <pre>{traceback}</pre>
    </details>
  );
}

export default Traceback;
