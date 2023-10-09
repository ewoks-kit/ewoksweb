/*
  The cell within a table when the row is in edit mode.
  Provides different input for any selected type (number, string, list etc)
*/
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import Input from '@mui/material/Input';
import type { ChangeEvent } from 'react';
import React, { useEffect } from 'react';

import type { CustomTableCellProps, EditableTableRow } from '../../../types';
import { isDecimalNumber } from '../../../utils/utils';
import SelectNameValue from './SelectNameValue';
import styles from './TableCellInEditMode.module.css';

function TableCellInEditMode(props: CustomTableCellProps) {
  const { index, row, name, onChange, typeOfValues, usedIn, disable } = props;

  const [valueToString, setValueToString] = React.useState<string>('true');

  useEffect(() => {
    setValueToString(
      row.value === undefined
        ? ''
        : row.value !== null
        ? // Need to show as string any kind of (value: unknown) it gets
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          row.value.toString()
        : 'null',
    );
  }, [row]);

  function onChangeNumber(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    if (isDecimalNumber(event.target.value)) {
      onChange(event, row, index);
    }
  }

  function onChangeBool(
    e: ChangeEvent<HTMLInputElement>,
    changedRow: EditableTableRow,
    rowIndex: number,
  ) {
    const event = {
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: e.target.value,
      },
    };
    onChange(event, changedRow, rowIndex);
  }

  if (name === 'value' && usedIn !== 'DataMapping') {
    if (row.type === 'bool' || row.type === 'boolean') {
      return (
        <RadioGroup
          name="value"
          value={valueToString}
          onChange={(e) => onChangeBool(e, row, index)}
          data-cy="radioInEditableCell"
        >
          <FormControlLabel
            disabled={disable}
            value="true"
            control={<Radio />}
            label="true"
            className={styles.smallRadio}
            color="primary"
          />
          <FormControlLabel
            disabled={disable}
            value="false"
            control={<Radio />}
            label="false"
            className={styles.smallRadio}
          />
        </RadioGroup>
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
            data-cy="inputInEditableCell"
          />
        </FormControl>
      );
    }
  }

  if (typeOfValues?.typeOfInput && typeOfValues.typeOfInput === 'select') {
    return <SelectNameValue {...props} />;
  }

  return (
    <FormControl variant="standard" fullWidth>
      <Input
        disabled={disable}
        value={row[name]}
        type="text"
        name={name}
        onChange={(e) => onChange(e, row, index)}
        className={styles.input}
        data-cy="inputInEditableCell"
      />
    </FormControl>
  );
}

export default TableCellInEditMode;
