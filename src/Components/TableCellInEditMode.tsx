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
import CellEditInJson from './CellEditInJson';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles(() => ({
  tableCell: {
    width: 120,
    height: 20,
    padding: '1px',
  },
  input: {
    width: 90,
    height: 20,
    padding: '1px',
  },
}));

function TableCellInEditMode(propsIn) {
  const { props } = propsIn;
  const { index, row, name, onChange, type, typeOfValues } = props;
  const classes = useStyles();
  console.log(index, row, name, onChange, type, typeOfValues);

  const [boolVal, setBoolVal] = React.useState(true);

  useEffect(() => {
    // console.log(row);
    setBoolVal(
      row.value !== null && row.value !== undefined
        ? row.value.toString()
        : 'null'
    );
  }, [row.value, row]);

  const onChangeBool = (e, row, index) => {
    const event = {
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: e.target.value,
      },
    };
    onChange(event, row, index);
  };

  return type === 'dict' || type === 'list' || type === 'object' ? (
    // <CellEditInJson props={{ row, name, type, onChange }} />
    <span>{JSON.stringify(row[name])}</span>
  ) : // <span></span>
  typeOfValues.type === 'select' ? (
    <>
      <FormControl
        fullWidth
        variant="outlined"
        // className={classes.detailsLabels}
      >
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          options={typeOfValues.values}
          value={row[name]}
          onChange={(e, val) =>
            onChange({ target: { value: val, name } }, row, index)
          }
          onInputChange={(e, val) =>
            onChange({ target: { value: val, name } }, row, index)
          }
          // onInputChange={(event, newInputValue) => {}}
          renderInput={(params) => (
            <TextField
              {...params}
              label={typeOfValues.type || 'name'}
              margin="normal"
              variant="outlined"
            />
          )}
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
      value={boolVal} // {row[name]}
      onChange={(e) => onChangeBool(e, row, index)}
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
    />
  ) : (
    <Input
      value={row[name] || ''}
      name={name}
      onChange={(e) => onChange(e, row, index)}
      className={classes.input}
    />
  );
}

export default TableCellInEditMode;
