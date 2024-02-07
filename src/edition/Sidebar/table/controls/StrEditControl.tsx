import { FormControl, Input } from '@mui/material';

import type { TypeOfValues } from '../../../../types';
import AutocompleteSelect from './AutocompleteSelect';
import styles from './StrEditControl.module.css';

interface Props {
  value: string | number;
  onChange: (newValue: string) => void;
  typeOfValues?: TypeOfValues;
  disable?: boolean;
  ariaLabel?: string;
}

function StrEditControl(props: Props) {
  const { value, typeOfValues, onChange, disable, ariaLabel } = props;

  if (typeOfValues?.typeOfInput && typeOfValues.typeOfInput === 'select') {
    return (
      <AutocompleteSelect
        value={value}
        onChange={onChange}
        typeOfValues={typeOfValues}
        disable={disable}
        ariaLabel={ariaLabel}
      />
    );
  }

  return (
    <FormControl variant="standard" fullWidth>
      <Input
        className={styles.input}
        value={value}
        type="text"
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ 'aria-label': ariaLabel }}
        disabled={disable}
      />
    </FormControl>
  );
}

export default StrEditControl;
