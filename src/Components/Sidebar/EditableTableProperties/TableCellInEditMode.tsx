/*
  The cell within a table when the row is in edit mode.
  Provides different input for any selected type (number, string, list etc)
*/
import type { ChangeEvent } from 'react';
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
// TODO: Keep the following if edit on the table is needed
// import CellEditInJson from './CellEditInJson';
import { Autocomplete } from '@material-ui/lab';
import type { CustomTableCellProps, EditableTableRow } from '../../../types';

const useStyles = makeStyles(() => ({
  input: {
    width: 90,
    height: 20,
    padding: '1px',
  },
}));

function TableCellInEditMode(props: CustomTableCellProps) {
  const { index, row, name, onChange, type, typeOfValues } = props;
  const classes = useStyles();

  const [valueToString, setValueToString] = React.useState<string>('true');

  useEffect(() => {
    setValueToString(
      row.value !== null && row.value !== undefined
        ? // I need to show as string any kind of (value: unknown) it gets
          // value can be any type in the dropdown
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          row.value.toString()
        : 'null'
    );
  }, [row.value, row]);

  function onChangeBool(
    e: ChangeEvent<HTMLInputElement>,
    changedRow: EditableTableRow,
    rowIndex: number
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

  return type === 'dict' || type === 'list' || type === 'object' ? (
    // TODO: examine if needed to edit in the cell?
    // <CellEditInJson props={{ row, name, type, onChange }} />
    <span>{JSON.stringify(row[name])}</span>
  ) : // <span></span>
  typeOfValues.type === 'select' ? (
    <>
      <FormControl fullWidth variant="outlined">
        <Autocomplete
          freeSolo
          options={typeOfValues.values}
          value={row[name]}
          onChange={(e, val) =>
            onChange({ target: { value: val, name } }, row, index)
          }
          onInputChange={(e, val) =>
            onChange({ target: { value: val, name } }, row, index)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={typeOfValues.type || 'name'}
              margin="normal"
              variant="outlined"
            />
          )}
          data-cy="autocompleteInputInEditableCell"
        />
      </FormControl>
      {/* <Select
        name={name}
        value={row[name]}
        label="type"
        onChange={(e) => onChange(e, row, index)}
      >
        {typeOfValues.values.map((tex) => (
          <MenuItem key={tex} value={tex}>
            {tex}
          </MenuItem>
        ))}
      </Select> */}
    </>
  ) : type === 'bool' || type === 'boolean' ? (
    <RadioGroup
      aria-label="gender"
      name="value"
      value={valueToString}
      onChange={(e) => onChangeBool(e, row, index)}
      data-cy="radioInEditableCell"
    >
      <FormControlLabel value="true" control={<Radio />} label="true" />
      <FormControlLabel value="false" control={<Radio />} label="false" />
    </RadioGroup>
  ) : type === 'number' ? (
    <Input
      value={row[name]}
      type="number"
      name={name}
      onChange={(e) => onChange(e, row, index)}
      className={classes.input}
      data-cy="inputInEditableCell"
    />
  ) : (
    <Input
      value={row[name] || ''}
      name={name}
      onChange={(e) => onChange(e, row, index)}
      className={classes.input}
      data-cy="inputInEditableCell"
    />
  );
}

export default TableCellInEditMode;
