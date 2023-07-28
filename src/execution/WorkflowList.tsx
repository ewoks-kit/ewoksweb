import type { EwoksJob } from '../api/models';
import WorkflowItem from './WorkflowItem';
import styles from './MonitorPage.module.css';
import { Link } from 'react-router-dom';

interface Props {
  jobs: EwoksJob[];
}

function WorkflowList(props: Props) {
  const { jobs } = props;

  if (jobs.length === 0) {
    return (
      <div className={styles.message}>
        <p>No workflow was run!</p>
        <p>
          You can open a workflow in the <Link to="/edit">Edit</Link> tab and
          click on <b>Execute Workflow</b> in the top-right menu to run it.
        </p>
      </div>
    );
  }

  return (
    <div role="list">
      {jobs
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
