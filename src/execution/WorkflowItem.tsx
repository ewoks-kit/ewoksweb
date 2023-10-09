import type { EventEwoks } from '../types';
import { assertDefined } from '../utils/typeGuards';
import Duration from './Duration';
import RerunButton from './RerunButton';
import StartTimeInfo from './StartTimeInfo';
import StatusBadge from './StatusBadge';
import Traceback from './Traceback';
import styles from './WorkflowItem.module.css';

interface Props {
  events: EventEwoks[];
}

function WorkflowItem(props: Props) {
  const { events } = props;

  const startJobEvent = events.find(
    (e) => e.context === 'job' && e.type === 'start',
  );
  assertDefined(startJobEvent, 'No start job event');
  const startWorkflowEvent = events.find(
    (e) => e.context === 'workflow' && e.type === 'start',
  );
  const endJobEvent = events.find(
    (e) => e.context === 'job' && e.type === 'end',
  );
  const hasFinished = !!endJobEvent;
  const hasError = endJobEvent?.error === true;

  const status = hasFinished ? (hasError ? 'Failed' : 'Success') : 'Running';

  const idFallback = hasError
    ? "Workflow couldn't start!"
    : 'Workflow starting...';

  const id = startWorkflowEvent?.workflow_id;

  return (
    <li className={styles.item} aria-label={id}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{id || idFallback}</h3>
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
        {hasError && endJobEvent.error_traceback && (
          <Traceback traceback={endJobEvent.error_traceback} />
        )}
        {id && <RerunButton id={id} />}
      </div>
    </li>
  );
}

export default WorkflowItem;
