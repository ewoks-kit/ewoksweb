import useStore from '../../store/useStore';
import styles from './WorkflowTitle.module.css';

export default function WorkflowTitle() {
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);

  if (!rootWorkflowId) {
    return (
      <h1 className={styles.crumbs}>
        Untitled workflow <span className={styles.labelHint}>(unsaved)</span>
      </h1>
    );
  }

  return <h1 className={styles.crumbs}>{displayedWorkflowInfo.id}</h1>;
}
