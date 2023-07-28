import { useExecutedJobs } from '../api/events';
import WorkflowList from './WorkflowList';

import styles from './MonitorPage.module.css';

function MonitorPage() {
  const jobs = useExecutedJobs();

  return (
    <div className={styles.container}>
      <h2>Executed workflows</h2>
      <WorkflowList jobs={[...jobs.values()]} />
    </div>
  );
}

export default MonitorPage;
