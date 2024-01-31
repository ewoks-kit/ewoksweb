/*
  The cell within a table when the row is in edit mode.
  Provides different input for any selected type (number, string, list etc)
*/
import { FormControl } from '@mui/material';
import Input from '@mui/material/Input';
import type { ChangeEvent } from 'react';

import type {
  InputTableRow,
  RowChangeEvent,
  TypeOfValues,
} from '../../../types';
import { isDecimalNumber } from '../../../utils/utils';
import AutocompleteSelect from './controls/AutocompleteSelect';
import BooleanControl from './controls/BooleanControl';
import styles from './TableCellInEditMode.module.css';

interface Props {
  row: InputTableRow;
  name: 'name' | 'value';
  onChange: (e: RowChangeEvent) => void;
  typeOfValues?: TypeOfValues;
  usedIn?: 'DataMapping' | 'DefaultInputs' | 'Conditions';
  disable?: boolean;
}

function TableCellInEditMode(props: Props) {
  const { row, name, onChange, typeOfValues, usedIn, disable } = props;

  function onChangeNumber(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    if (isDecimalNumber(event.target.value)) {
      onChange(event);
    }
  }

  if (name === 'value' && usedIn !== 'DataMapping') {
    if (row.type === 'bool' || row.type === 'boolean') {
      return (
        <BooleanControl
          value={row.value}
          onChange={(e) => {
            onChange(e);
          }}
          disabled={disable}
        />
      );
    }

    if (row.type === 'number') {
      return (
        <FormControl variant="standard" fullWidth>
          <Input
            disabled={disable}
            value={row[name]}
            type="text"
            name={name}
            onChange={(event) => onChangeNumber(event)}
            className={styles.input}
            inputProps={{ 'aria-label': `Edit input ${name}` }}
          />
        </FormControl>
      );
    }
  }

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
        disabled={disable}
        value={row[name]}
        type="text"
        name={name}
        onChange={(e) => onChange(e)}
        className={styles.input}
        inputProps={{ 'aria-label': `Edit input ${name}` }}
      />
    </FormControl>
  );
}

export default TableCellInEditMode;
