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
import DraggableDialog from '../../../general/DraggableDialog';
import useSnackbarStore from 'store/useSnackbarStore';
import type { Condition, EditableTableRow, Inputs, TypeOfValues } from 'types';
import type { ChangeEvent } from 'react';
import { createData, getType } from './utils';
import TableHeader from './TableHeader';
import TypeSelectCell from './TypeSelect';
import ToolsCell from './ToolsCell';
import AddRowButton from './AddRowButton';
import { TableCell } from '@material-ui/core';

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
    marginLeft: '10px',
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
  plusButtonTableCell: {
    textAlign: 'end',
    width: '20%',
    height: 15,
    padding: '0 5px 0 0',
  },
}));

interface EditableTableProps {
  headers: string[];
  defaultValues: Condition[] | Inputs[];
  typeOfValues: TypeOfValues[];
  valuesChanged: (rows: EditableTableRow[]) => void;
  onRowAdd?: (rows?: EditableTableRow[]) => void;
}

interface DialogContent {
  id: string;
  title: string;
  object: object;
  callbackProps: { rows: EditableTableRow[]; id: string };
}

// The table where lines can be added where type is selected and appropriate values are given to name and value.
function EditableTable(props: EditableTableProps) {
  const [rows, setRows] = React.useState<EditableTableRow[]>([]);
  const [typeOfInputs, setTypeOfInputs] = React.useState<string[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogContent, setDialogContent] = React.useState<DialogContent>();
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);

  const { defaultValues, headers, onRowAdd } = props;

  useEffect(() => {
    setTypeOfInputs(defaultValues.map(getType));
    setRows(defaultValues.map(createData));
  }, [defaultValues]);

  const classes = useStyles();

  function showEditableDialog(
    id: string,
    title: string,
    graph: unknown,
    callbackProps: { rows: EditableTableRow[]; id: string }
  ) {
    if (typeof graph !== 'object' || graph === null) {
      return;
    }
    setOpenDialog(true);
    setDialogContent({
      id,
      title,
      object: graph,
      callbackProps,
    });
  }

  function calcNewRows(rowId: string | undefined): EditableTableRow[] {
    return rows.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          id: row.name || '',
        };
      }

      return row;
    });
  }

  function onListOrDict(id: string, index: number): unknown {
    if (typeOfInputs[index] === 'list') {
      if (Array.isArray(rows[index].value)) {
        return rows[index].value;
      }
      return [];
    }

    if (
      typeof rows[index].value === 'object' &&
      !Array.isArray(rows[index].value)
    ) {
      return rows[index].value;
    }
    return {};
  }

  function onEditRow(id: string, index: number) {
    if (['list', 'dict'].includes(typeOfInputs[index])) {
      showEditableDialog(
        id,
        typeOfInputs[index] === 'list' ? 'Edit list' : 'Edit dict',
        onListOrDict(id, index),
        { rows, id }
      );
    }

    setRows(calcNewRows(id));
  }

  function onChange(
    e: { target: { name: string; value: string | number } },
    row: EditableTableRow,
    index: number
  ) {
    const { id } = row;
    const oldRows = [...rows].filter((_row, i) => index !== i);

    if (
      e.target.name === 'name' &&
      oldRows.map((r) => r.name).includes(e.target.value as string)
    ) {
      showErrorMsg('Not allowed to assign the same property TWICE!');
      // return;
    }
    if (
      ['string', 'bool', 'number', 'boolean', 'null'].includes(
        typeOfInputs[index]
      )
    ) {
      const { value, name } = e.target;

      const newRows = rows.map((rowe) => {
        if (rowe.id === id) {
          return { ...rowe, [name]: value };
        }
        return rowe;
      });
      setRows(newRows);
      props.valuesChanged(newRows);
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

  const changedTypeOfInputs = (
    e: ChangeEvent<HTMLInputElement>,
    row: EditableTableRow,
    index: number
  ) => {
    const { id: rowId = '' } = row;

    const newRows = rows.map((rowe) => {
      if (rowe.id === rowId) {
        return {
          ...rowe,
          value: e.target.value === 'null' ? e.target.value : '',
          type: e.target.value,
        };
      }
      return rowe;
    });

    setRows(newRows);
    props.valuesChanged(newRows);

    const tOfI = [...typeOfInputs];
    tOfI[index] = e.target.value;
    setTypeOfInputs(tOfI);
  };

  function setRowValue(
    name: string,
    val: unknown, // can be a user defined list or dict
    callbackProps: { id: string; rows: EditableTableRow[] }
  ) {
    const newRows = callbackProps.rows.map((row) => {
      if (row.id === callbackProps.id) {
        return name !== ''
          ? { ...row, id: name, value: val }
          : { ...row, value: val };
      }
      return row;
    });
    props.valuesChanged(newRows);
    setRows(newRows);
  }

  return (
    <>
      {dialogContent && (
        <DraggableDialog
          open={openDialog}
          content={dialogContent}
          setValue={setRowValue}
        />
      )}
      <Table
        className={classes.table}
        aria-label="editable table"
        size="small"
        padding="none"
      >
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
                />

                <TypeSelectCell
                  className={classes.tableCell}
                  value={
                    typeOfInputs[index] !== 'boolean'
                      ? typeOfInputs[index]
                      : 'bool'
                  }
                  onChange={(e) => changedTypeOfInputs(e, row, index)}
                />

                <CustomTableCell
                  index={index}
                  row={row}
                  name="value"
                  onChange={onChange}
                  onEdit={() => onEditRow(row.id || '', index)}
                />

                <ToolsCell onDelete={() => onDelete(row.id || '')} />
              </TableRow>
            </React.Fragment>
          ))}
          {onRowAdd && (
            <TableRow>
              <TableCell align="left" className={classes.plusButtonTableCell} />
              <TableCell align="left" className={classes.plusButtonTableCell}>
                <AddRowButton onClick={() => onRowAdd(rows)} />
              </TableCell>
              <TableCell />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default EditableTable;
