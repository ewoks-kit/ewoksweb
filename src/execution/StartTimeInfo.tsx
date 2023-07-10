import { Event as EventIcon } from '@material-ui/icons';
import ReactTimeago from 'react-timeago';

import styles from './WorkflowItem.module.css';

interface Props {
  time: string;
}

const ONE_DAY_IN_MS = 24 * 3600 * 1000;

function StartTimeInfo(props: Props) {
  const { time } = props;

  const startDate = new Date(time);
  const now = new Date(Date.now());

  return (
    <div className={styles.time}>
      <EventIcon fontSize="small" />
      {now.valueOf() - startDate.valueOf() < ONE_DAY_IN_MS ? (
        <ReactTimeago date={startDate.toString()} />
      ) : (
        startDate.toString()
      )}
    </div>
  );
}

export default StartTimeInfo;
