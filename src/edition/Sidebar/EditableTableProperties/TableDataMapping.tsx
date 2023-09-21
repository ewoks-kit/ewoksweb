/*
  The table that is used to pass parameters for data-mapping.
*/
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import CustomTableCell from './CustomTableCell';
import type { DataMapping, TypeOfValues } from 'types';
import TableHeader from './TableHeader';
import ToolsCell from './ToolsCell';
import { TableCell } from '@material-ui/core';
import AddRowButton from './AddRowButton';

interface TableDataMappingProps {
  inactive?: boolean;
  headers: string[];
  values: DataMapping[];
  typeOfValues: TypeOfValues[];
  valuesChanged: (rows: DataMapping[]) => void;
  onRowAdd?: (rows?: DataMapping[]) => void;
}

const useStyles = makeStyles(() => ({
  table: (props: { inactive: boolean | undefined }) => ({
    padding: '1px',
    minWidth: 160,
    wordBreak: 'break-all',
    opacity: props.inactive ? '0.2' : '1',
  }),
  tableCell: {
    textAlign: 'end',
    width: '50%',
    height: 15,
    padding: '0 5px 0 0',
  },
}));

function TableDataMapping(props: TableDataMappingProps) {
  const { values, headers, inactive, onRowAdd } = props;

  const classes = useStyles({ inactive });

  function onChange(
    e: { target: { name: string; value: string | number } },
    row: DataMapping
  ) {
    const { id } = row;
    let { value } = e.target;
    const { name } = e.target;

    if (name === 'value') {
      value = typeof value === 'number' ? Number(value) : value;
    }

    const newRows = values.map((rowe) => {
      if (rowe.id === id) {
        return { ...rowe, [name]: value };
      }
      return rowe;
    });

    props.valuesChanged(newRows);
  }

  function onDelete(id: string) {
    const newRows = values.filter((row) => {
      return row.id !== id;
    });

    props.valuesChanged(newRows);
  }

  return (
    <>
      <Table className={classes.table} aria-label="data-mapping-table">
        <TableHeader headers={headers} />
        <TableBody>
          {values.map((row, index) => (
            <React.Fragment key={row.id}>
              <TableRow>
                <CustomTableCell
                  index={index}
                  row={row}
                  rowsNames={values.map((ro) => ro.name || '')}
                  name="name"
                  onChange={onChange}
                  typeOfValues={props.typeOfValues[0]}
                  usedIn="DataMapping"
                  inactive={inactive}
                />
                <CustomTableCell
                  index={index}
                  row={row}
                  name="value"
                  onChange={onChange}
                  typeOfValues={props.typeOfValues[1]}
                  usedIn="DataMapping"
                  inactive={inactive}
                />
                <ToolsCell
                  inactive={inactive}
                  onDelete={() => onDelete(row.id || '')}
                />
              </TableRow>
            </React.Fragment>
          ))}
          {onRowAdd && !inactive && (
            <TableRow>
              <TableCell align="left" className={classes.tableCell}>
                <AddRowButton
                  onClick={() => onRowAdd(values)}
                  ariaLabel="Add data mapping entry"
                />
              </TableCell>
              <TableCell />
            </TableRow>
          )}
        </TableBody>
      </Table>
      {inactive && (
        <div style={{ backgroundColor: '#f9f9e2' }}>
          Data Mappings have no effect when Map all Data is enabled. They will
          be removed when saving the workflow.
        </div>
      )}
    </>
  );
}

export default TableDataMapping;
