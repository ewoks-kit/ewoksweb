import { useEffect, useState } from 'react';
import styles from './Execution.module.css';
import useStore from '../store/useStore';
import { useExecutionEvents, useMutateExecutionEvents } from '../api/events';
import type { filterParams } from '../types';
import ExecutedWorkflowItem from './ExecutedWorkflowItem';

function ExecutedWorkflows() {
  const executedWorkflows = useStore((state) => state.executedWorkflows);
  const setExecutedWorkflows = useStore((state) => state.setExecutedWorkflows);
  const [filters] = useState<filterParams>({
    starttime: '2020-06-13',
  });

  const { executionEvents } = useExecutionEvents(filters);
  const mutateExecutionEvents = useMutateExecutionEvents();

  useEffect(() => {
    setExecutedWorkflows(executionEvents.jobs, false);

    const interval = setInterval(() => {
      mutateExecutionEvents(filters);
    }, 30_000);

    return () => {
      clearInterval(interval);
    };
  }, [executionEvents, filters, mutateExecutionEvents, setExecutedWorkflows]);

  return (
    <div className={styles.container}>
      {executedWorkflows.map((workflowEvents) => (
        <ExecutedWorkflowItem
          workflowEvents={workflowEvents}
          key={workflowEvents[0].job_id}
        />
      ))}
    </div>
  );
}

export default ExecutedWorkflows;
