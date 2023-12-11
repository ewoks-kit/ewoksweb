import { useNodesLength } from '../../store/graph-hooks';
import styles from './FallbackMessage.module.css';

export default function FallbackMessage() {
  const nodesCount = useNodesLength();

  if (nodesCount !== 0) {
    return null;
  }

  return (
    <div className={styles.noWorkflowMessage}>
      <p>
        <strong>Drag and drop</strong> tasks here to start building your
        workflow,
        <br />
        or use <em>Quick Open</em> to <strong>open</strong> an existing
        workflow.
      </p>
    </div>
  );
}
