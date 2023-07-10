import styles from './Execution.module.css';
import { useExecutionEvents } from '../api/events';
import ExecutedWorkflowItem from './ExecutedWorkflowItem';

function ExecutedWorkflows() {
  const { executionEvents } = useExecutionEvents();

  return (
    <div className={styles.container}>
      {executionEvents.jobs.map((workflowEvents) => (
        <ExecutedWorkflowItem
          key={workflowEvents[0].job_id}
          workflowEvents={workflowEvents}
        />
      ))}
    </div>
  );
}

export default ExecutedWorkflows;
