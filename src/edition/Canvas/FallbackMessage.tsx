import { useNodesLength } from '../../store/graph-hooks';
import useStore from '../../store/useStore';
import styles from './Canvas.module.css';

export default function FallbackMessage() {
  const nodesCount = useNodesLength();
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);

  return (
    <div className={styles.noWorkflowMessage}>
      {nodesCount === 0 && rootWorkflowId === '' && (
        <p>
          <strong>Drag and drop</strong> tasks here to start building your
          workflow,
          <br />
          or use <em>Quick Open</em> to <strong>open</strong> an existing
          workflow.
        </p>
      )}
    </div>
  );
}
