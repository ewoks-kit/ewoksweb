import { useEffect, useState } from 'react';
import styles from './Execution.module.css';
import useStore from '../../store/useStore';
import { useExecutionEvents, useMutateExecutionEvents } from '../../api/events';
import type { filterParams } from '../../types';
import { formatDate } from './utils';
import EventBoundary from '../../EventBoundary';

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
    <EventBoundary>
      <div className={styles.executionTable}>
        {executedWorkflows.map((workflowEvents) => (
          <button
            key={workflowEvents[0].job_id}
            className={styles.executionItem}
            data-error={
              workflowEvents[workflowEvents.length - 1].error === true ||
              undefined
            }
            tabIndex={0}
            type="button"
          >
            <label className={styles.executionData}>
              {workflowEvents[1]?.workflow_id ||
                workflowEvents[0]?.workflow_id ||
                'No id'}
            </label>
            <label className={styles.executionData}>
              {formatDate(workflowEvents[1]?.time || '')}
            </label>
            <label className={styles.executionData}>
              {workflowEvents[1]?.executing || ''}
            </label>
            <label className={styles.executionData}>
              {workflowEvents[1]?.status || ''}
              {workflowEvents[workflowEvents.length - 1].error?.toString()}
            </label>
          </button>
        ))}
      </div>
    </EventBoundary>
  );
}

export default ExecutedWorkflows;
