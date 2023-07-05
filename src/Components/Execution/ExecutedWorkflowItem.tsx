import type { Event } from '../../types';
import styles from './Execution.module.css';
import { formatDate } from './utils';

interface ExecutedWorkflowItemProps {
  workflowEvents: Event[];
}

function ExecutedWorkflowItem(props: ExecutedWorkflowItemProps) {
  const { workflowEvents } = props;
  return (
    <div
      className={styles.item}
      data-error={
        workflowEvents[workflowEvents.length - 1].error === true || undefined
      }
    >
      <div className={styles.field}>
        {workflowEvents[1]?.workflow_id ||
          workflowEvents[0]?.workflow_id ||
          'No id'}
      </div>
      <div className={styles.field}>
        {formatDate(workflowEvents[1]?.time || '')}
      </div>
      <div className={styles.field}>
        {workflowEvents[1]?.status || ''}
        {workflowEvents[workflowEvents.length - 1].error ? 'FAILED' : 'SUCCESS'}
      </div>
    </div>
  );
}

export default ExecutedWorkflowItem;
