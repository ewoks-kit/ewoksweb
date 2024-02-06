import { FormControl, Input } from '@mui/material';

import type { RowValue } from '../../../../types';
import styles from './MultiTypeEditControl.module.css';

interface Props {
  value: RowValue;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function NumberInput(props: Props) {
  const { value, onChange, disabled } = props;

  return (
    <FormControl variant="standard" fullWidth>
      <Input
        disabled={disabled}
        value={value}
        type="number"
        onChange={(event) => {
          const { value: newValue } = event.target;
          if (newValue) {
            onChange(Number(newValue));
          }
        }}
        className={styles.input}
        inputProps={{ 'aria-label': `Edit input value` }}
      />
    </FormControl>
  );
}

export default NumberInput;
