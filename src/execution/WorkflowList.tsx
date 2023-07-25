import { useExecutedJobs } from '../api/events';
import WorkflowItem from './WorkflowItem';

import styles from './WorkflowList.module.css';

function WorkflowList() {
  const jobs = useExecutedJobs();

  return (
    <div className={styles.container}>
      <h2>Executed workflows</h2>
      {[...jobs.values()]
        .sort(
          (a, b) =>
            new Date(b[0].time).valueOf() - new Date(a[0].time).valueOf()
        )
        .map((events) => (
          <WorkflowItem key={events[0].job_id} events={events} />
        ))}
    </div>
  );
}

export default WorkflowList;
