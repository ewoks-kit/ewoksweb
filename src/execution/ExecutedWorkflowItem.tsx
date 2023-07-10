import type { EwoksEvent } from '../types';
import { assertDefined } from '../utils/typeGuards';
import StatusBadge from './StatusBadge';
import { formatDate } from './utils';

import styles from './ExecutedWorkflowItem.module.css';

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
  const hasFinished = !!endJobEvent;
  const hasError = endJobEvent?.error === true;

  const status = hasFinished ? (hasError ? 'Failed' : 'Success') : 'Running';

  const idFallback = hasError
    ? "Workflow couldn't start!"
    : 'Workflow starting...';

  return (
    <div className={styles.item}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            {startWorkflowEvent?.workflow_id || idFallback}
          </h3>
          <span className={styles.jobId}>Job id: {startJobEvent.job_id}</span>
        </div>
        <div>Started on {formatDate(startJobEvent.time)}</div>
      </div>

      <div className={styles.description}>
        <StatusBadge status={status} />
        {hasError && (
          <details className={styles.traceback}>
            <summary>Traceback</summary>
            <pre>{endJobEvent.error_traceback}</pre>
          </details>
        )}
      </div>
    </div>
  );
}

export default ExecutedWorkflowItem;
