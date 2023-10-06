import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';

import type { EwoksJob } from '../api/models';
import styles from './MonitorPage.module.css';
import WorkflowItem from './WorkflowItem';
import WorkflowItemErrorFallback from './WorkflowItemErrorFallback';

interface Props {
  jobs: EwoksJob[];
}

function WorkflowList(props: Props) {
  const { jobs } = props;

  if (jobs.length === 0) {
    return (
      <div className={styles.message}>
        <p>No workflow was run!</p>
        <p>
          You can open a workflow in the <Link to="/edit">Edit</Link> tab and
          click on <b>Execute Workflow</b> in the top-right menu to run it.
        </p>
      </div>
    );
  }

  return (
    <div role="list">
      {jobs
        .sort(
          (a, b) =>
            new Date(b[0].time).valueOf() - new Date(a[0].time).valueOf(),
        )
        .map((events) => (
          <ErrorBoundary
            key={events[0].job_id}
            FallbackComponent={WorkflowItemErrorFallback}
          >
            <WorkflowItem events={events} />
          </ErrorBoundary>
        ))}
    </div>
  );
}

export default WorkflowList;
