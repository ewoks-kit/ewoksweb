import SuspenseBoundary from '../../../suspense/SuspenseBoundary';
import type { EngineDropdownOption } from '../models';
import EngineDropdown from './EngineDropdown';
import styles from './ExecutionOptions.module.css';
import QueueDropdown from './QueueDropdown';

interface Props {
  engine: EngineDropdownOption;
  setEngine: (engine: EngineDropdownOption) => void;
  queue: string;
  setQueue: (queue: string) => void;
}
function ExecutionOptions(props: Props) {
  const { engine, setEngine, queue, setQueue } = props;

  return (
    <div className={styles.container}>
      <EngineDropdown value={engine} setValue={setEngine} />
      <SuspenseBoundary>
        <QueueDropdown value={queue} setValue={setQueue} />
      </SuspenseBoundary>
    </div>
  );
}

export default ExecutionOptions;
