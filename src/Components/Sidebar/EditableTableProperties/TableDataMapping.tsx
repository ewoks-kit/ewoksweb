/*
  The table that is used to pass parameters for data-mapping.
*/
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import CustomTableCell from './CustomTableCell';
import type { DataMapping, EditableTableRow, TypeOfValues } from 'types';
import TableHeader from './TableHeader';
import ToolsCell from './ToolsCell';
import { TableCell } from '@material-ui/core';
import AddRowButton from './AddRowButton';

export const useStyles = makeStyles(() => ({
  table: {
    padding: '1px',
    minWidth: 160,
    wordBreak: 'break-all',
  },
  tableCell: {
    textAlign: 'end',
    width: '50%',
    height: 15,
    padding: '0 5px 0 0',
  },
}));

interface TableDataMappingProps {
  headers: string[];
  values: DataMapping[];
  typeOfValues: TypeOfValues[];
  valuesChanged: (rows: EditableTableRow[]) => void;
  onRowAdd?: (rows?: EditableTableRow[]) => void;
}

function TableDataMapping(props: TableDataMappingProps) {
  const [rows, setRows] = React.useState<EditableTableRow[]>([]);

  const { values, headers, onRowAdd } = props;

  useEffect(() => {
    setRows(values);
  }, [values]);
  const classes = useStyles();

  function onChange(
    e: { target: { name: string; value: string | number } },
    row: EditableTableRow
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
                rowsNames={rows.map((ro) => ro.name || '')}
                name="value"
                onChange={onChange}
                typeOfValues={props.typeOfValues[1]}
                usedIn="DataMapping"
              />
              <ToolsCell onDelete={() => onDelete(row.id || '')} />
            </TableRow>
          </React.Fragment>
        ))}
        {onRowAdd && (
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
  );
}

export default TableDataMapping;
