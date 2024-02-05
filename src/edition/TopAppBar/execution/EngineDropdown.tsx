import type { EngineDropdownOption } from '../models';
import styles from './ExecutionOptions.module.css';

interface Props {
  value: EngineDropdownOption;
  setValue: (newValue: EngineDropdownOption) => void;
}

function EngineDropdown(props: Props) {
  const { value, setValue } = props;

  return (
    <div className={styles.selectContainer}>
      <span className={styles.label}>Execution engine</span>
      <select
        className={styles.select}
        value={value}
        onChange={(event) => {
          const { value: newValue } = event.target;
          setValue(newValue as EngineDropdownOption);
        }}
        aria-label="Change execution engine"
      >
        <option value="default">default</option>
        <option value="pypushflow">pypushflow</option>
        <option value="dask">dask</option>
      </select>
    </div>
  );
}

export default EngineDropdown;
