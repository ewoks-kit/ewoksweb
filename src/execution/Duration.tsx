import { AccessTime } from '@material-ui/icons';

import { formatDuration } from './utils';
import styles from './WorkflowItem.module.css';

interface Props {
  startTime: string;
  endTime: string;
}

function Duration(props: Props) {
  const { startTime, endTime } = props;

  if (!endTime) {
    return null;
  }

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  const duration = new Date(endDate.valueOf() - startDate.valueOf());

  return (
    <div className={styles.time}>
      <AccessTime fontSize="small" />
      {formatDuration(duration)}
    </div>
  );
}

export default Duration;
