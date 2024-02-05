import { useWorkers } from '../../../api/execution';
import styles from './ExecutionOptions.module.css';

interface Props {
  value: string;
  setValue: (newValue: string) => void;
}

function WorkerDropdown(props: Props) {
  const { value, setValue } = props;
  const workers = useWorkers();

  if (workers === null) {
    // Celery not set up: worker cannot be selected
    return null;
  }

  return (
    <div className={styles.selectContainer}>
      <span className={styles.label}>Executing worker</span>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Change executing worker"
      >
        {workers.map((worker) => (
          <option key={worker} value={worker}>
            {worker}
          </option>
        ))}
      </select>
    </div>
  );
}

export default WorkerDropdown;
