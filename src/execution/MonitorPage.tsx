import { useExecutedJobs } from '../api/events';
import styles from './MonitorPage.module.css';
import WorkflowList from './WorkflowList';

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
