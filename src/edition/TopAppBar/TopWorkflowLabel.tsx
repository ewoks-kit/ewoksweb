import useStore from '../../store/useStore';
import styles from './TopAppBar.module.css';

export default function TopWorkflowLabel() {
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);

  if (!rootWorkflowId) {
    return (
      <>
        Untitled workflow <span className={styles.labelHint}>(unsaved)</span>
      </>
    );
  }

  return <span>{displayedWorkflowInfo.label || displayedWorkflowInfo.id}</span>;
}
