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
} from '@material-ui/core';
import type { CustomTableCellProps, EditableTableRow } from '../../../types';
import SelectNameValue from './SelectNameValue';

const useStyles = makeStyles(() => ({
  input: {
    fontSize: '12px',
  },
  smallRadio: {
    '& span': {
      padding: '0px 8px',
      margin: '0px',
    },
    '& svg': {
      width: '0.7em',
      height: '0.7em',
      color: 'blue',
    },
    '& .MuiFormControlLabel-label': {
      fontSize: '14px',
    },
  },
}));

function TableCellInEditMode(props: CustomTableCellProps) {
  const { index, row, name, onChange, values } = props;

  const classes = useStyles();

  const [valueToString, setValueToString] = React.useState<string>('true');

  console.log(index, row, name, values);

  useEffect(() => {
    setValueToString(
      row.value === undefined
        ? ''
        : row.value !== null
        ? // Need to show as string any kind of (value: unknown) it gets
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

  if (
    name === 'value' &&
    row.type &&
    ['dict', 'list', 'object'].includes(row.type)
  ) {
    return <span>{JSON.stringify(row[name])}</span>;
  }

  if (name === 'value' && (row.type === 'bool' || row.type === 'boolean')) {
    return (
      <RadioGroup
        name="value"
        value={valueToString}
        onChange={(e) => onChangeBool(e, row, index)}
        data-cy="radioInEditableCell"
      >
        <FormControlLabel
          value="true"
          control={<Radio />}
          label="true"
          className={classes.smallRadio}
          color="primary"
        />
        <FormControlLabel
          value="false"
          control={<Radio />}
          label="false"
          className={classes.smallRadio}
        />
      </RadioGroup>
    );
  }

  if (name === 'value' && row.type === 'number') {
    return (
      <FormControl fullWidth style={{ marginLeft: '5px' }}>
        <Input
          value={row[name]}
          type="number"
          name={name}
          onChange={(e) => onChange(e, row, index)}
          className={classes.input}
          data-cy="inputInEditableCell"
        />
      </FormControl>
    );
  }

  if (values.allValues && values.allValues.length > 0) {
    return <SelectNameValue {...props} />;
  }

  return (
    <FormControl fullWidth style={{ marginLeft: '5px' }}>
      <Input
        value={row[name] || ''}
        name={name}
        onChange={(e) => onChange(e, row, index)}
        className={classes.input}
        data-cy="inputInEditableCell"
      />
    </FormControl>
  );
}

export default TableCellInEditMode;
