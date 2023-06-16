import type { KeyboardEvent } from 'react';
import { useEffect, useState } from 'react';
import styles from './Execution.module.css';
import ExecutionFilters from './ExecutionFilters';
import useStore from '../../store/useStore';
import { getExecutionEvents } from '../../api/api';
import type { ExecutedJobsResponse } from '../../types';

const headers = ['Workflow name', 'Start time', 'End time', 'status'];

function ExecutedWorkflows() {
  const [selectedRow, setSelectedRow] = useState<string>();
  const [showDialog, setShowDialog] = useState(false);
  const executedWorkflows = useStore((state) => state.executedWorkflows);
  const setExecutedWorkflows = useStore((state) => state.setExecutedWorkflows);

  useEffect(() => {
    async function fetchEvents() {
      const response = await getExecutionEvents({ starttime: '2020-06-13' });
      if (response.data) {
        const execJobs = response.data as ExecutedJobsResponse;
        setExecutedWorkflows(execJobs.jobs, false);
      } else {
        /* eslint-disable no-console */
        console.log('no response data');
      }
    }
    fetchEvents();
  }, [setExecutedWorkflows]);

  const handleRowClick = (rowId: string) => {
    if (selectedRow === rowId) {
      setSelectedRow('');
      setShowDialog(false);
    } else {
      setSelectedRow(rowId);
      setShowDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setSelectedRow('');
    setShowDialog(false);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    rowId: string | undefined
  ) => {
    if (event.key === 'Enter' && rowId) {
      event.preventDefault();
      handleRowClick(rowId);
    }
  };

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
          key={workflowEvents[0].job_id}
          className={`${styles.executionRow} ${
            selectedRow === workflowEvents[0].job_id ? styles.highlighted : ''
          }`}
          onClick={() => handleRowClick(workflowEvents[0].job_id || '')}
          onKeyDown={(event) => handleKeyDown(event, workflowEvents[0].job_id)}
          tabIndex={0}
          role="button"
        >
          <div className={styles.executionCell}>
            {workflowEvents[1].workflow_id}
          </div>
          <div className={styles.executionCell}>{workflowEvents[1].time}</div>
          <div className={styles.executionCell}>
            {workflowEvents[1].executing}
          </div>
          <div className={styles.executionCell}>{workflowEvents[1].status}</div>
          {showDialog && (
            <div className={styles.dialogOverlay}>
              <div className={styles.dialog}>
                <div className={styles.dialogContent}>
                  All workflow Events in details
                  <button onClick={handleCloseDialog} type="submit">
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
