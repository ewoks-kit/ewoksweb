import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Input from '@material-ui/core/Input';
import {
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@material-ui/core';
import ReactJson from 'react-json-view';

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

function CustomTableCell({ index, row, name, onChange, type, typeOfValues }) {
  const classes = useStyles();
  const { isEditMode } = row;
  // console.log(index, row, name, onChange, type, typeOfValues);

  const [boolVal, setBoolVal] = React.useState(true);

  useEffect(() => {
    // console.log(row);
    setBoolVal(row.value !== null ? row.value.toString() : 'null');
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

  return (
    <TableCell align="left" className={classes.tableCell}>
      {/* In edit mode the type comes from sidebar in data-mapping and
      from the selected type here for conditions and default-values */}
      {isEditMode ? (
        type === 'dict' || type === 'list' || type === 'object' ? (
          <ReactJson
            src={
              type === 'dict' && row[name] === ''
                ? {}
                : type === 'list' && row[name] === ''
                ? []
                : row[name]
            }
            name={name}
            theme="monokai"
            collapsed
            collapseStringsAfterLength={30}
            groupArraysAfterLength={15}
            // onEdit={(edit) => onChange(edit, row, index)}
            // onAdd={(add) => onChange(add, row, index)}
            defaultValue="object"
            // onDelete={(del) => onChange(del, row, index)}
            // onSelect={(sel) => onChange(sel, row, index)}
            quotesOnKeys={false}
            style={{ backgroundColor: 'rgb(59, 77, 172)' }}
            displayDataTypes
            // defaultValue={object}
          />
        ) : type === 'select' ? (
          <Select
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
          </Select>
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
        )
      ) : typeof row[name] === 'object' ? (
        JSON.stringify(row[name])
      ) : (
        row[name].toString()
      )}
    </TableCell>
  );
}

export default CustomTableCell;
