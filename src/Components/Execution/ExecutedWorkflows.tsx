import type { KeyboardEvent, MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import styles from './Execution.module.css';
import ExecutionFilters from './ExecutionFilters';
import useStore from '../../store/useStore';
import { getExecutionEvents } from '../../api/api';
import type { ExecutedJobsResponse, filterParams } from '../../types';
import { formatDate } from './utils';

const headers = ['Workflow name', 'Start time', 'End time', 'status'];

function ExecutedWorkflows() {
  const [selectedRow, setSelectedRow] = useState<string>();
  const [showDialog, setShowDialog] = useState(false);
  const executedWorkflows = useStore((state) => state.executedWorkflows);
  const setExecutedWorkflows = useStore((state) => state.setExecutedWorkflows);
  const [filters] = useState<filterParams>({
    starttime: '2020-06-13',
  });

  useEffect(() => {
    async function fetchEvents() {
      const response = await getExecutionEvents(filters);
      if (response.data) {
        const execJobs = response.data as ExecutedJobsResponse;
        setExecutedWorkflows(execJobs.jobs, false);
      } else {
        /* eslint-disable no-console */
        console.log('no response data');
      }
    }

    fetchEvents();

    const interval = setInterval(() => {
      fetchEvents();
    }, 30_000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRowClick(rowId: string) {
    if (selectedRow === rowId) {
      setSelectedRow('');
      setShowDialog(false);
    } else {
      setSelectedRow(rowId);
      setShowDialog(true);
    }
  }

  function handleCloseDialog(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    console.log(showDialog);
    setShowDialog(false);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
    rowId: string | undefined
  ) {
    if (event.key === 'Enter' && rowId) {
      event.preventDefault();
      handleRowClick(rowId);
    }
  }

  return (
    <div className={styles.executionTable}>
      <ExecutionFilters />
      <div className={styles.executionRow}>
        {headers.map((header) => (
          <div className={styles.executionCell} key={header}>
            {header}
          </div>
        ))}
      </div>
      {executedWorkflows.map((workflowEvents) => (
        <div
          key={`${workflowEvents[0].job_id || ''} ${
            workflowEvents[0].time || 'time'
          }`}
          className={`${styles.executionRow} ${
            selectedRow === workflowEvents[0].job_id ? styles.highlighted : ''
          } ${
            (workflowEvents[workflowEvents.length - 1].error &&
              styles.workflowErrorRow) ||
            ''
          }`}
          onClick={() => handleRowClick(workflowEvents[0].job_id || '')}
          onKeyDown={(event) => handleKeyDown(event, workflowEvents[0].job_id)}
          tabIndex={0}
          role="button"
        >
          <div className={styles.executionCell}>
            {workflowEvents[1]?.workflow_id ||
              workflowEvents[0]?.workflow_id ||
              'No id'}
          </div>
          <div className={styles.executionCell}>
            {formatDate(workflowEvents[1]?.time || '')}
          </div>
          <div className={styles.executionCell}>
            {workflowEvents[1]?.executing || ''}
          </div>
          <div className={styles.executionCell}>
            {workflowEvents[1]?.status || ''}
          </div>
          {showDialog && (
            <div className={styles.dialogOverlay}>
              <div className={styles.dialog}>
                <div className={styles.dialogContent}>
                  All workflow Events in details
                  <button
                    onClick={(event) => handleCloseDialog(event)}
                    type="submit"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ExecutedWorkflows;
