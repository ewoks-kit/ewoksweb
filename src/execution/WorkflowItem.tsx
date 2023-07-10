import type { EwoksEvent } from '../types';
import { assertDefined } from '../utils/typeGuards';
import StatusBadge from './StatusBadge';
import StartTimeInfo from './StartTimeInfo';

import styles from './WorkflowItem.module.css';
import Duration from './Duration';

interface Props {
  events: EwoksEvent[];
}

function WorkflowItem(props: Props) {
  const { events } = props;

  const startJobEvent = events.find(
    (e) => e.context === 'job' && e.type === 'start'
  );
  assertDefined(startJobEvent);
  const startWorkflowEvent = events.find(
    (e) => e.context === 'workflow' && e.type === 'start'
  );
  const endJobEvent = events.find(
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
          <StartTimeInfo time={startJobEvent.time} />
          {endJobEvent && (
            <Duration
              startTime={startJobEvent.time}
              endTime={endJobEvent.time}
            />
          )}
        </div>
        <span>Job id: {startJobEvent.job_id}</span>
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

export default WorkflowItem;
