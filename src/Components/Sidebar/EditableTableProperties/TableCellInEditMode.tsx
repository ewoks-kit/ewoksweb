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
  Typography,
} from '@material-ui/core';
// TODO: Keep the following if edit on the table is needed
// import CellEditInJson from './CellEditInJson';
import { Autocomplete } from '@material-ui/lab';
import type { CustomTableCellProps, EditableTableRow } from '../../../types';

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

  if (type && ['dict', 'list', 'object'].includes(type)) {
    return <span>{JSON.stringify(row[name])}</span>;
  }

  const renderOption = (option: string) => {
    const matches = typeOfValues.requiredValues?.includes(option);

    return (
      <li>
        <Typography
          component="div"
          variant="body1"
          style={matches ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}
        >
          {option}
        </Typography>
      </li>
    );
  };

  if (typeOfValues.type === 'select') {
    const options = typeOfValues.values || [''];
    return (
      <FormControl fullWidth>
        <Autocomplete
          disableClearable
          freeSolo={options.length === 0}
          options={options}
          renderOption={renderOption}
          value={(row[name] as string) || ''}
          onChange={(e, val) =>
            onChange({ target: { value: val, name } }, row, index)
          }
          onInputChange={(e, val) =>
            onChange({ target: { value: val, name } }, row, index)
          }
          renderInput={(params) => <TextField {...params} margin="normal" />}
          data-cy="autocompleteInputInEditableCell"
        />
      </FormControl>
    );
  }

  if (type === 'bool' || type === 'boolean') {
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

  if (type === 'number') {
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
