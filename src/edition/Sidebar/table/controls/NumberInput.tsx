import { FormControl, Input } from '@mui/material';

import type { RowValue } from '../../../../types';
import { isDecimalNumber } from '../../../../utils/utils';
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
        onChange={(event) => {
          const { value: newValue } = event.target;
          if (isDecimalNumber(newValue)) {
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
