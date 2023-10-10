import { isBoolean } from 'lodash';
import type { ChangeEvent } from 'react';

import styles from './BooleanControl.module.css';

interface Props {
  value: unknown;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
          name="value"
          value="true"
          checked={value === 'true'}
          onChange={onChange}
          disabled={disabled}
        />
        true
      </label>

      <label id="falseLabel">
        <input
          className={styles.input}
          aria-labelledby="falseLabel"
          type="radio"
          name="value"
          value="false"
          checked={value === 'false'}
          onChange={onChange}
          disabled={disabled}
        />
        false
      </label>
    </div>
  );
}

export default BooleanControl;
