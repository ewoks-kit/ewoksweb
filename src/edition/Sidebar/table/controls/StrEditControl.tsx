import { FormControl, Input } from '@mui/material';

import type {
  InputTableRow,
  RowChangeEvent,
  TypeOfValues,
} from '../../../../types';
import AutocompleteSelect from './AutocompleteSelect';
import styles from './StrEditControl.module.css';

interface Props {
  row: InputTableRow;
  name: 'name' | 'value';
  onChange: (e: RowChangeEvent) => void;
  typeOfValues?: TypeOfValues;
  disable?: boolean;
}

function StrEditControl(props: Props) {
  const { row, name, typeOfValues, onChange, disable } = props;

  if (typeOfValues?.typeOfInput && typeOfValues.typeOfInput === 'select') {
    return (
      <AutocompleteSelect
        row={row}
        name={name}
        onChange={onChange}
        typeOfValues={typeOfValues}
        disable={disable}
      />
    );
  }

  return (
    <FormControl variant="standard" fullWidth>
      <Input
        className={styles.input}
        value={row[name]}
        type="text"
        name={name}
        onChange={(e) => onChange(e)}
        inputProps={{ 'aria-label': `Edit input ${name}` }}
        disabled={disable}
      />
    </FormControl>
  );
}

export default StrEditControl;
