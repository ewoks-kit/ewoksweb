/*
  The table that is used to pass parameters for data-mapping.
*/
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import CustomTableCell from './CustomTableCell';
import useStore from 'store/useStore';
import type { DataMapping, EditableTableRow } from 'types';
import { createDataMappingData } from './utils';
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
  typeOfValues: { type: string; values?: string[] }[];
  valuesChanged: (rows: EditableTableRow[]) => void;
  onRowAdd?: (rows?: EditableTableRow[]) => void;
}

function TableDataMapping(props: TableDataMappingProps) {
  const [rows, setRows] = React.useState<EditableTableRow[]>([]);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const { values, headers, onRowAdd } = props;

  useEffect(() => {
    setRows(values.map(createDataMappingData));
  }, [values]);
  const classes = useStyles();

  function onChange(
    e: { target: { name: string; value: string | number } },
    row: EditableTableRow,
    index: number
  ) {
    const { id } = row;
    let { value } = e.target;
    const { name } = e.target;
    const oldRows = [...rows].filter((_row, i) => index !== i);

    if (
      e.target.name === 'name' &&
      oldRows.map((r) => r.name).includes(e.target.value as string)
    ) {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to assign the same property TWICE!',
        severity: 'error',
      });
      // return;
    }

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
                type=""
                typeOfValues={props.typeOfValues[0]}
                headers={headers}
              />
              <CustomTableCell
                index={index}
                row={row}
                name="value"
                onChange={onChange}
                type=""
                typeOfValues={props.typeOfValues[1]}
                headers={headers}
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
