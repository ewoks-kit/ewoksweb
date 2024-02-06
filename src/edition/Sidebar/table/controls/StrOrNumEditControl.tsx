import { FormControl, Input } from '@mui/material';

import type { TypeOfValues } from '../../../../types';
import AutocompleteSelect from './AutocompleteSelect';
import styles from './StrOrNumEditControl.module.css';

interface Props {
  value: string | number;
  onChange: (newValue: string | number) => void;
  typeOfValues?: TypeOfValues;
  disable?: boolean;
  ariaLabel?: string;
}

function StrOrNumEditControl(props: Props) {
  const { value, typeOfValues, onChange, disable, ariaLabel } = props;

  function handleChange(newValue: string) {
    const newValueAsInt = Number.parseInt(newValue);

    onChange(Number.isFinite(newValueAsInt) ? newValueAsInt : newValue);
  }

  if (typeOfValues?.typeOfInput && typeOfValues.typeOfInput === 'select') {
    return (
      <AutocompleteSelect
        value={value}
        onChange={handleChange}
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
        onChange={(e) => handleChange(e.target.value)}
        inputProps={{ 'aria-label': ariaLabel }}
        disabled={disable}
      />
    </FormControl>
  );
}

export default StrOrNumEditControl;
