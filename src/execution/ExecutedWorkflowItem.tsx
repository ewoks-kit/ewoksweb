import type { EwoksEvent } from '../types';
import { assertDefined } from '../utils/typeGuards';
import styles from './Execution.module.css';
import { formatDate } from './utils';

interface ExecutedWorkflowItemProps {
  workflowEvents: EwoksEvent[];
}

function ExecutedWorkflowItem(props: ExecutedWorkflowItemProps) {
  const { workflowEvents } = props;

  const startJobEvent = workflowEvents.find(
    (e) => e.context === 'job' && e.type === 'start'
  );
  assertDefined(startJobEvent);
  const startWorkflowEvent = workflowEvents.find(
    (e) => e.context === 'workflow' && e.type === 'start'
  );
  const endJobEvent = workflowEvents.find(
    (e) => e.context === 'job' && e.type === 'end'
  );
  const hasError = endJobEvent?.error === true;

  const idFallback = hasError
    ? "Workflow couldn't start!"
    : 'Workflow starting...';

  return (
    <div className={styles.item} data-error={hasError || undefined}>
      <div className={styles.field}>
        {startWorkflowEvent?.workflow_id || idFallback}
      </div>
      <div className={styles.field}>{formatDate(startJobEvent.time)}</div>
      <div className={styles.field}>{hasError ? 'FAILED' : 'SUCCESS'}</div>
    </div>
  );
}

export default ExecutedWorkflowItem;
