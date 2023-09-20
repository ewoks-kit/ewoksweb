/*
  The table that is used to pass parameters for data-mapping.
*/
import React, { useEffect } from 'react';
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
  inactive: boolean | undefined;
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
  const [rows, setRows] = React.useState<DataMapping[]>([]);

  const { values, headers, inactive, onRowAdd } = props;

  useEffect(() => {
    setRows(values);
  }, [values]);

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

    const newRows = rows.map((rowe) => {
      if (rowe.id === id) {
        return { ...rowe, [name]: value };
      }
      return rowe;
    });

    setRows(newRows);
    props.valuesChanged(newRows);
  }

  function onDelete(id: string) {
    const newRows = rows.filter((row) => {
      return row.id !== id;
    });

    setRows(newRows);
    props.valuesChanged(newRows);
  }

  return (
    <>
      <Table className={classes.table} aria-label="data-mapping-table">
        <TableHeader headers={headers} />
        <TableBody>
          {rows.map((row, index) => (
            <React.Fragment key={row.id}>
              <TableRow>
                <CustomTableCell
                  index={index}
                  row={row}
                  rowsNames={rows.map((ro) => ro.name || '')}
                  name="name"
                  onChange={onChange}
                  typeOfValues={props.typeOfValues[0]}
                  usedIn="DataMapping"
                />
                <CustomTableCell
                  index={index}
                  row={row}
                  name="value"
                  onChange={onChange}
                  typeOfValues={props.typeOfValues[1]}
                  usedIn="DataMapping"
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
                  onClick={() => onRowAdd(rows)}
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
          Data Mappings will be deleted if Map all Data is selected
        </div>
      )}
    </>
  );
}

export default TableDataMapping;
