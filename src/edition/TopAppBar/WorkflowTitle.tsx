import useWorkflowStore from '../../store/useWorkflowStore';
import styles from './WorkflowTitle.module.css';

export default function WorkflowTitle() {
  const workflowId = useWorkflowStore((state) => state.workflowInfo.id);

  if (!workflowId) {
    return (
      <h1 className={styles.crumbs}>
        Untitled workflow <span className={styles.labelHint}>(unsaved)</span>
      </h1>
    );
  }

  return <h1 className={styles.crumbs}>{workflowId}</h1>;
}
