import { isBoolean } from 'lodash';

import styles from './BooleanControl.module.css';

interface Props {
  value: unknown;
  onChange: (newValue: boolean) => void;
  disabled?: boolean;
}

function BooleanControl(props: Props) {
  const { value: rawValue, onChange, disabled } = props;

  const value = isBoolean(rawValue) ? rawValue.toString() : rawValue;

  return (
    <div className={styles.container}>
      <label id="trueLabel">
        <input
          className={styles.input}
          aria-labelledby="trueLabel"
          type="radio"
          value="true"
          checked={value === 'true'}
          onChange={() => onChange(true)}
          disabled={disabled}
        />
        true
      </label>

      <label id="falseLabel">
        <input
          className={styles.input}
          aria-labelledby="falseLabel"
          type="radio"
          value="false"
          checked={value === 'false'}
          onChange={() => onChange(false)}
          disabled={disabled}
        />
        false
      </label>
    </div>
  );
}

export default BooleanControl;
