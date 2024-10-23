import ClearIcon from '@mui/icons-material/Clear';
import type { ChangeEvent } from 'react';

import { useCssColors } from '../../hooks';
import styles from './ColorPicker.module.css';

interface Props {
  defaultColorVariable: string;
  value: string | undefined;
  onChange: (newValue: string | undefined) => void;
  label: string;
}

function ColorPicker(props: Props) {
  const { defaultColorVariable, value, onChange, label } = props;

  const [[defaultColor], rootRef] = useCssColors([defaultColorVariable]);

  return (
    <div ref={rootRef} className={styles.container}>
      <label id="pickerLabel">{label}</label>
      <input
        className={styles.input}
        aria-labelledby="pickerLabel"
        type="color"
        value={value || defaultColor}
        // https://github.com/cypress-io/cypress/issues/7812#issuecomment-964403375
        onInput={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
      />
      {value && (
        <button
          className={styles.button}
          type="button"
          aria-label="Reset color to default"
          onClick={() => {
            onChange(undefined);
          }}
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
}

export default ColorPicker;
