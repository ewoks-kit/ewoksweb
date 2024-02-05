import { FormControl } from '@mui/material';
import Input from '@mui/material/Input';
import type { ChangeEvent } from 'react';

import type { InputTableRow, RowChangeEvent } from '../../../../types';
import { RowType } from '../../../../types';
import { isDecimalNumber } from '../../../../utils/utils';
import BooleanControl from './BooleanControl';
import styles from './MultiTypeEditControl.module.css';

interface Props {
  row: InputTableRow;
  name: 'name' | 'value';
  onChange: (e: RowChangeEvent) => void;
  disable?: boolean;
}

function MultiTypeEditControl(props: Props) {
  const { row, name, onChange, disable } = props;

  function onChangeNumber(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    if (isDecimalNumber(event.target.value)) {
      onChange(event);
    }
  }

  if (row.type === RowType.Bool) {
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

  if (row.type === RowType.Number) {
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

export default MultiTypeEditControl;
