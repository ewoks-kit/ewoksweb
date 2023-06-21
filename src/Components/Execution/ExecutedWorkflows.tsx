import { useEffect, useState } from 'react';
import styles from './Execution.module.css';
import useStore from '../../store/useStore';
import { useExecutionEvents, useMutateExecutionEvents } from '../../api/events';
import type { filterParams } from '../../types';
import { formatDate } from './utils';
import EventBoundary from '../../EventBoundary';

function ExecutedWorkflows() {
  const [selectedRow, setSelectedRow] = useState<string>();
  const [showDialog, setShowDialog] = useState(false);
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

  function handleRowClick(rowId: string) {
    if (selectedRow === rowId) {
      setSelectedRow('');
      setShowDialog(false);
    } else {
      setSelectedRow(rowId);
      setShowDialog(true);
    }
  }

  return (
    <EventBoundary>
      <div className={styles.executionTable}>
        {executedWorkflows.map((workflowEvents) => (
          <button
            key={workflowEvents[0].job_id}
            className={styles.executionItem}
            data-highlight={
              selectedRow === workflowEvents[0].job_id || undefined
            }
            data-error={
              workflowEvents[workflowEvents.length - 1].error === true ||
              undefined
            }
            onClick={() => handleRowClick(workflowEvents[0].job_id || '')}
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
            {showDialog && (
              <div className={styles.dialogOverlay}>
                <div className={styles.dialog}>
                  <div className={styles.dialogContent}>
                    All workflow Events in details
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowDialog(false);
                      }}
                      type="submit"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </EventBoundary>
  );
}

export default ExecutedWorkflows;
