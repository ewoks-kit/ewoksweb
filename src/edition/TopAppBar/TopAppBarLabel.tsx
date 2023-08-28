import useStore from '../../store/useStore';
import SubgraphStack from './SubgraphStack';

import styles from './TopAppBar.module.css';

export default function TopAppBarLabel() {
  const subgraphsStack = useStore((state) => state.subgraphsStack);
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo
  );

  if (subgraphsStack.length === 0 || !subgraphsStack[0].label) {
    return (
      <span data-cy="untitled_workflow">
        Untitled_workflow <span className={styles.labelHint}>(unsaved)</span>
      </span>
    );
  }

  if (subgraphsStack.length > 1) {
    return <SubgraphStack />;
  }

  return (
    <span data-cy={displayedWorkflowInfo.label}>
      {displayedWorkflowInfo.label}
    </span>
  );
}
