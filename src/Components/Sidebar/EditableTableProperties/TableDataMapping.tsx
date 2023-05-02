/*
  The table that is used to pass parameters for default-values, conditions and data-mapping.
  Its cells can change depending on the kind of input and the parent-component params.
*/
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import CustomTableCell from './CustomTableCell';
import useStore from 'store/useStore';
import type { Conditions, DataMapping, EditableTableRow, Inputs } from 'types';
import { createData, getType } from './utils';
import TableHeader from './TableHeader';
import ToolsCell from './ToolsCell';

export const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    padding: '1px',
    overflowX: 'auto',
  },
  table: {
    padding: '1px',
    minWidth: 160,
    wordBreak: 'break-all',
  },
  selectTableCell: {
    width: 28,
    padding: '1px',
  },
  tableCell: {
    width: 120,
    height: 20,
    padding: '1px',
  },
}));

interface EditableTableProps {
  headers: string[];
  defaultValues: DataMapping[] | Conditions[] | Inputs[];
  typeOfValues: { type: string; values?: string[] }[];
  valuesChanged: (rows: EditableTableRow[]) => void;
}

// The table where lines can be added where type is selected and appropriate values are given to name and value.
function TableDataMapping(props: EditableTableProps) {
  const [rows, setRows] = React.useState<EditableTableRow[]>([]);
  const [typeOfInputs, setTypeOfInputs] = React.useState<string[]>([]);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const { defaultValues, headers } = props;

  useEffect(() => {
    setTypeOfInputs(defaultValues.map(getType));
    setRows(defaultValues.map(createData));
  }, [defaultValues]);
  console.log(props);

  const classes = useStyles();

  function calcNewRows(rowId: string | undefined): EditableTableRow[] {
    return rows.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          id: row.name?.replace(' ', '_') || '',
          isEditMode: !row.isEditMode,
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
      setRows(calcNewRows(id));
      props.valuesChanged(rows);
    }
  }

  function onChange(
    e: { target: { name: string; value: string | number } },
    row: EditableTableRow,
    index: number
  ) {
    const { id } = row;
    if (
      ['string', 'bool', 'number', 'boolean', 'null'].includes(
        typeOfInputs[index]
      )
    ) {
      let { value } = e.target;
      const { name } = e.target;

      if (name === 'value') {
        value = typeOfInputs[index] === 'number' ? Number(value) : value;
      }

      const newRows = rows.map((rowe) => {
        if (rowe.id === id) {
          return { ...rowe, [name]: value };
        }
        return rowe;
      });
      setRows(newRows);
      return;
    }
    // DOC: it is 'dict' or 'list' and uses the dialog
    const name = e.target.name === 'name' ? e.target.name : 'value';

    const newRows = rows.map((rowTable) => {
      if (rowTable.id === id) {
        return {
          ...rowTable,
          // TODO: if not to use the local editing the e.target.name is always a 'name'
          [name]: e.target.name === 'name' ? e.target.value : undefined,
        };
      }
      return rowTable;
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
    <Table className={classes.table} aria-label="editable table">
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
                type={typeOfInputs[index]}
                typeOfValues={props.typeOfValues[1]}
                headers={headers}
              />
              <ToolsCell
                onSave={() => onSaveRow(row.id, index)}
                onDelete={() => onDelete(row.id || '')}
                isEditing={row.isEditMode}
              />
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
}

export default TableDataMapping;
