import SuspenseBoundary from '../../../suspense/SuspenseBoundary';
import type { EngineDropdownOption } from '../models';
import EngineDropdown from './EngineDropdown';
import styles from './ExecutionOptions.module.css';
import WorkerDropdown from './WorkerDropdown';

interface Props {
  engine: EngineDropdownOption;
  setEngine: (engine: EngineDropdownOption) => void;
  worker: string;
  setWorker: (worker: string) => void;
}
function ExecutionOptions(props: Props) {
  const { engine, setEngine, worker, setWorker } = props;

  return (
    <div className={styles.container}>
      <EngineDropdown value={engine} setValue={setEngine} />
      <SuspenseBoundary>
        <WorkerDropdown value={worker} setValue={setWorker} />
      </SuspenseBoundary>
    </div>
  );
}

export default ExecutionOptions;
