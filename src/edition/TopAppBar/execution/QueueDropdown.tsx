import { useQueues } from '../../../api/execution';
import styles from './ExecutionOptions.module.css';

interface Props {
  value: string;
  setValue: (newValue: string) => void;
}

function QueueDropdown(props: Props) {
  const { value, setValue } = props;
  const queues = useQueues();

  if (queues === null) {
    // Celery not set up: queue cannot be selected
    return null;
  }

  return (
    <div className={styles.selectContainer}>
      <span className={styles.label}>Job queue</span>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Change job queue"
      >
        {queues.map((queue) => (
          <option key={queue} value={queue}>
            {queue}
          </option>
        ))}
      </select>
    </div>
  );
}

export default QueueDropdown;
