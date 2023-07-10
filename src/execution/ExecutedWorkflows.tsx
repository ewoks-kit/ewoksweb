import { useExecutionEvents } from '../api/events';
import ExecutedWorkflowItem from './ExecutedWorkflowItem';

import styles from './ExecutedWorkflows.module.css';

function ExecutedWorkflows() {
  const { executionEvents } = useExecutionEvents();

  return (
    <div className={styles.container}>
      <h2>Executed workflows</h2>
      {executionEvents.jobs
        .sort(
          (a, b) =>
            new Date(b[0].time).valueOf() - new Date(a[0].time).valueOf()
        )
        .map((workflowEvents) => (
          <ExecutedWorkflowItem
            key={workflowEvents[0].job_id}
            workflowEvents={workflowEvents}
          />
        ))}
    </div>
  );
}

export default ExecutedWorkflows;
