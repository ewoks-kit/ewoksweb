/*
  The table that is used to pass parameters for default-values, conditions and data-mapping.
  Its cells can change depending on the kind of input and the parent-component params.
*/
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CustomTableCell from './CustomTableCell';
import DraggableDialog from 'Components/General/DraggableDialog';
import useStore from 'store/useStore';
import type { Conditions, DataMapping, EditableTableRow, Inputs } from 'types';
import type { ChangeEvent } from 'react';
import { createData, getType } from './utils';
import TableHeader from './TableHeader';
import TypeSelectCell from './TypeSelect';
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
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [dialogContent, setDialogContent] = React.useState<DialogContent>();
  const [disableSelectType, setDisableSelectType] = React.useState(true);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const { defaultValues, headers } = props;

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
          id: row.name?.replace(' ', '_') || '',
          isEditMode: !row.isEditMode,
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

    setDisableSelectType(false);
  }

  function onSaveRow(id: string | undefined, index: number) {
    const oldRows = [...rows].filter((row, i) => index !== i);
    console.log(id, index, oldRows);

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

    setDisableSelectType(true);
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
    console.log(id);

    setRows(newRows);
    props.valuesChanged(newRows);
    setDisableSelectType(false);
  }

  const changedTypeOfInputs = (
    e: ChangeEvent<HTMLInputElement>,
    row: EditableTableRow,
    index: number
  ) => {
    const { id: rowId = '' } = row;
    if (e.target.value === 'null') {
      const newRows = rows.map((rowe) => {
        if (rowe.id === rowId) {
          return { ...rowe, value: e.target.value };
        }
        return rowe;
      });
      setRows(newRows);
    }
    const tOfI = [...typeOfInputs];
    tOfI[index] = e.target.value;
    setTypeOfInputs(tOfI);

    if (e.target.value === 'list') {
      showEditableDialog(rowId, 'Edit list', [], {
        rows,
        id: rowId,
      });
    }

    if (e.target.value === 'dict') {
      showEditableDialog(rowId, 'Edit dict', {}, { rows, id: rowId });
    }
  };

  function setRowValue(
    name: string,
    val: unknown, // can be a user defined list or dict
    callbackProps: { id: string; rows: EditableTableRow[] }
  ) {
    const newRows = callbackProps.rows.map((row) => {
      if (row.id === callbackProps.id) {
        return name !== ''
          ? { ...row, name, value: val }
          : { ...row, value: val };
      }
      return row;
    });
    props.valuesChanged(newRows);
    setRows(newRows);
  }

  return (
    <Paper className={classes.root}>
      {dialogContent && (
        <DraggableDialog
          open={openDialog}
          content={dialogContent}
          setValue={setRowValue}
          typeOfValues={props.typeOfValues[0]}
        />
      )}
      <Table className={classes.table} aria-label="editable table">
        <TableHeader headers={headers} />
        <TableBody>
          {rows.map((row, index) => (
            <React.Fragment key={row.id}>
              <TableRow>
                {!headers[0].startsWith('Source') && (
                  <TypeSelectCell
                    className={classes.tableCell}
                    value={
                      typeOfInputs[index] !== 'boolean'
                        ? typeOfInputs[index]
                        : 'bool'
                    }
                    disabled={disableSelectType}
                    onChange={(e) => changedTypeOfInputs(e, row, index)}
                  />
                )}
                <CustomTableCell
                  index={index}
                  row={row}
                  name="name"
                  onChange={onChange}
                  type=""
                  typeOfValues={props.typeOfValues[0]}
                />
                <CustomTableCell
                  index={index}
                  row={row}
                  name="value"
                  onChange={onChange}
                  type={typeOfInputs[index]}
                  typeOfValues={{
                    type:
                      headers[0].startsWith('Source') ||
                      headers[1] === 'Node_Id'
                        ? props.typeOfValues[1]?.type
                        : typeOfInputs[index],
                    values:
                      headers[0].startsWith('Source') ||
                      headers[1] === 'Node_Id'
                        ? props.typeOfValues[1]?.values
                        : [''],
                  }}
                />

                <ToolsCell
                  onSave={() => onSaveRow(row.id, index)}
                  onEdit={() => onEditRow(row.id || '', index)}
                  onDelete={() => onDelete(row.id || '')}
                  isEditing={row.isEditMode}
                />
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default EditableTable;
