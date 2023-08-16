import type { EwoksEvent } from '../types';
// import { assertDefined } from '../utils/typeGuards';
import StatusBadge from './StatusBadge';
import StartTimeInfo from './StartTimeInfo';

import styles from './WorkflowItem.module.css';
import Duration from './Duration';
import Traceback from './Traceback';
import RerunButton from './RerunButton';

interface Props {
  events: EwoksEvent[];
}

function WorkflowItem(props: Props) {
  const { events } = props;

  const startJobEvent = events.find(
    (e) => e.context === 'job' && e.type === 'start'
  );
  // assertDefined(startJobEvent);
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

  const id = startWorkflowEvent?.workflow_id;
  const noInfo = 'No information provided';

  return (
    <div className={styles.item} role="listitem" aria-label={id}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{id || idFallback}</h3>
          <StartTimeInfo time={startJobEvent?.time || noInfo} />
          {endJobEvent && (
            <Duration
              startTime={startJobEvent?.time || noInfo}
              endTime={endJobEvent.time}
            />
          )}
        </div>
        <span>Job id: {startJobEvent?.job_id || noInfo}</span>
      </div>

      <div className={styles.description}>
        <StatusBadge status={status} />
        {hasError && endJobEvent.error_traceback && (
          <Traceback traceback={endJobEvent.error_traceback} />
        )}
        {id && <RerunButton id={id} />}
      </div>
    </div>
  );
}

export default WorkflowItem;
