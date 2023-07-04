import type { Event } from '../../types';
import styles from './Execution.module.css';
import { formatDate } from './utils';

interface ExecutedWorkflowItemProps {
  workflowEvents: Event[];
}

function ExecutedWorkflowItem(props: ExecutedWorkflowItemProps) {
  const { workflowEvents } = props;
  return (
    <button
      className={styles.executionItem}
      data-error={
        workflowEvents[workflowEvents.length - 1].error === true || undefined
      }
      tabIndex={0}
      type="button"
    >
      <label className={styles.executionData}>
        {workflowEvents[1]?.workflow_id ||
          workflowEvents[0]?.workflow_id ||
          'No id'}
      </label>
      <label className={styles.executionData}>
        {formatDate(workflowEvents[1]?.time || '')}
      </label>
      <label className={styles.executionData}>
        {workflowEvents[1]?.status || ''}
        {workflowEvents[workflowEvents.length - 1].error?.toString()}
      </label>
    </button>
  );
}

export default ExecutedWorkflowItem;
