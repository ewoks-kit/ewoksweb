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
import { IconButton, TableCell } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

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
  onRowAdd?: () => void;
}

// The table where lines can be added where type is selected and appropriate values are given to name and value.
function TableDataMapping(props: TableDataMappingProps) {
  const [rows, setRows] = React.useState<EditableTableRow[]>([]);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const { values, headers } = props;

  useEffect(() => {
    setRows(values.map(createDataMappingData));
  }, [values]);
  const classes = useStyles();

  function calcNewRows(rowId: string | undefined): EditableTableRow[] {
    return rows.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          id: row.name?.replace(' ', '_') || '',
        };
      }
      return row;
    });
  }

  function onSaveRow(id: string | undefined, index: number) {
    const oldRows = [...rows].filter((row, i) => index !== i);

    if (
      rows[index].name !== '' &&
      oldRows.map((r) => r.name).includes(rows[index].name)
    ) {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to assign the same property TWICE!',
        severity: 'error',
      });
    } else {
      const newRows = calcNewRows(id);
      setRows(newRows);
      props.valuesChanged(newRows);
    }
  }

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
              <ToolsCell
                disableSave={row.name === '' || row.value === ''}
                onSave={() => onSaveRow(row.id, index)}
                onDelete={() => onDelete(row.id || '')}
              />
            </TableRow>
          </React.Fragment>
        ))}
        <TableRow>
          <TableCell align="left" className={classes.tableCell}>
            <IconButton
              style={{ padding: '1px' }}
              aria-label="dataMapping"
              onClick={() => props.onRowAdd?.()}
              data-cy="addDataMappingButton"
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </TableCell>
          <TableCell />
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default TableDataMapping;
