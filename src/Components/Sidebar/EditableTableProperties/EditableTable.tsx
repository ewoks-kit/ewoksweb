/*
  The table that is used to pass parameters for default-values, conditions and data-mapping.
  Its cells can change depending on the kind of input and the parent-component params.
*/
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';
import { Fab, FormControl, MenuItem, Select } from '@material-ui/core';
import CustomTableCell from './CustomTableCell';
import DraggableDialog from 'Components/General/DraggableDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import useStore from 'store/useStore';
import type { Conditions, DataMapping, EditableTableRow, Inputs } from 'types';
import SaveIcon from '@material-ui/icons/Save';
import type { ChangeEvent } from 'react';

const useStyles = makeStyles(() => ({
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

function createData(pair: DataMapping | Conditions | Inputs): EditableTableRow {
  return pair.id && (pair.value || pair.value === null || pair.value === false)
    ? { ...pair, isEditMode: false }
    : {
        id: Object.values(pair)[0],
        name: Object.values(pair)[0],
        value: Object.values(pair)[1],
        isEditMode: false,
        type:
          pair.value === 'true' || pair.value === 'false'
            ? 'boolean'
            : pair.value === null
            ? 'null'
            : typeof pair.value,
      };
}

interface EditableTableProps {
  headers: string[];
  defaultValues: DataMapping[] | Conditions[] | Inputs[];
  typeOfValues: { type: string; values?: string[] }[];
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  valuesChanged(rows: EditableTableRow[]): void | DataMapping[];
}
// The table where lines can be added where type is selected and appropriete values are given to name and value...
function EditableTable(props: EditableTableProps) {
  const [rows, setRows] = React.useState<EditableTableRow[]>([]);
  const [typeOfInputs, setTypeOfInputs] = React.useState<string[]>([]);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [dialogContent, setDialogContent] = React.useState({});
  const [disableSelectType, setDisableSelectType] = React.useState(false);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const { defaultValues } = props;
  const { headers } = props;

  const typesOfInputs = ['bool', 'number', 'string', 'list', 'dict', 'null'];

  useEffect(() => {
    const tOfIn = defaultValues.map((val) =>
      val.value === true ||
      val.value === false ||
      val.value === 'true' ||
      val.value === 'false'
        ? 'boolean'
        : Array.isArray(val.value)
        ? 'list'
        : val.value === 'null' || val.value === null
        ? 'null'
        : typeof val.value === 'object'
        ? 'dict'
        : typeof val.value === 'number'
        ? 'number'
        : 'string'
    );
    setTypeOfInputs(tOfIn);
    setRows(
      defaultValues
        ? defaultValues.map((pair: DataMapping | Conditions | Inputs) => {
            return createData(pair);
          })
        : []
    );
    setDisableSelectType(true);
  }, [defaultValues]);

  const classes = useStyles();

  function showEditableDialog({ name, title, graph, callbackProps }) {
    setOpenDialog(true);
    setDialogContent({
      id: name,
      title,
      object: graph,
      callbackProps,
    });
  }

  function calcNewRows(rowId: string): EditableTableRow[] {
    return rows.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          id: row.name.replace(' ', '_') || '',
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
      showEditableDialog({
        name: id,
        title: typeOfInputs[index] === 'list' ? 'Edit list' : 'Edit dict',
        graph: onListOrDict(id, index),
        callbackProps: { rows, id },
      });
    }

    setRows(calcNewRows(id));

    setDisableSelectType(false);
  }

  function onSaveRow(id: string, index: number) {
    const oldRows = [...rows].filter((row, inde) => index !== inde);

    if (
      rows[index].name !== '' &&
      oldRows.map((oldro) => oldro.name).includes(rows[index].name)
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
    const name = e.target?.name === 'name' ? e.target.name : 'value';

    const newRows = rows.map((rowTable) => {
      if (rowTable.id === id) {
        return {
          ...rowTable,
          // TODO: if not to use the local editing the e.target.name is always a 'name'
          [name]: e.target?.name === 'name' ? e.target.value : undefined,
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
    setDisableSelectType(false);
  }

  const changedTypeOfInputs = (
    e: ChangeEvent<HTMLInputElement>,
    row: EditableTableRow,
    index: number
  ) => {
    if (e.target.value === 'null') {
      const newRows = rows.map((rowe) => {
        if (rowe.id === row.id) {
          return { ...rowe, value: e.target.value };
        }
        return rowe;
      });
      setRows(newRows);
    }
    const tOfI = [...typeOfInputs];
    tOfI[index] = e.target.value;
    setTypeOfInputs(tOfI);
    if (['dict', 'list'].includes(e.target.value)) {
      showEditableDialog({
        name: row.id,
        title: e.target.value === 'list' ? 'Edit list' : 'Edit dict',
        graph: e.target.value === 'list' ? [] : {},
        callbackProps: { rows, id: row.id },
      });
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
      <DraggableDialog
        open={openDialog}
        content={dialogContent}
        setValue={setRowValue}
        typeOfValues={props.typeOfValues[0]}
      />
      <Table className={classes.table} aria-label="editable table">
        <TableHead>
          <TableRow>
            {!headers[0].startsWith('Source') && (
              <TableCell align="left" className={classes.tableCell}>
                Type
              </TableCell>
            )}
            <TableCell align="left" className={classes.tableCell}>
              <b>{headers[0]}</b>
            </TableCell>
            <TableCell align="left" className={classes.tableCell}>
              <b>{headers[1]}</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <React.Fragment key={row.id}>
              <TableRow key={row.id}>
                {!headers[0].startsWith('Source') && (
                  <TableCell
                    align="left"
                    size="small"
                    className={classes.tableCell}
                  >
                    <FormControl disabled={disableSelectType}>
                      <Select
                        value={
                          typeOfInputs[index] !== 'boolean'
                            ? typeOfInputs[index]
                            : 'bool'
                        }
                        label="Task type"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          changedTypeOfInputs(e, row, index)
                        }
                      >
                        {typesOfInputs.map((tex) => (
                          <MenuItem key={tex} value={tex}>
                            {tex}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                )}
                <CustomTableCell
                  {...{
                    index,
                    row,
                    name: 'name',
                    onChange,
                    type: '',
                    typeOfValues: props.typeOfValues?.[0],
                  }}
                />
                <CustomTableCell
                  {...{
                    index,
                    row,
                    name: 'value',
                    onChange,
                    type: typeOfInputs[index],
                    typeOfValues: {
                      type:
                        headers[0].startsWith('Source') ||
                        headers[1] === 'Node_Id'
                          ? props?.typeOfValues?.[1]?.type
                          : typeOfInputs[index],
                      values:
                        headers[0].startsWith('Source') ||
                        headers[1] === 'Node_Id'
                          ? props?.typeOfValues?.[1]?.values
                          : [''],
                    }, //
                  }}
                />

                <TableCell className={classes.selectTableCell}>
                  {row.isEditMode ? (
                    <IconButton
                      color="inherit"
                      onClick={() => onSaveRow(row.id, index)}
                      className={classes.root}
                      aria-label="edit"
                      data-cy="doneEditingButtonEditableTable"
                    >
                      <Fab
                        // className={classes.openFileButton}
                        color="primary"
                        size="small"
                        component="span"
                        aria-label="add"
                      >
                        <SaveIcon fontSize="small" />
                      </Fab>
                    </IconButton>
                  ) : (
                    <span>
                      <IconButton
                        className={classes.root}
                        aria-label="edit"
                        onClick={() => onEditRow(row.id, index)}
                        color="primary"
                        data-cy="editButtonEditableTable"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        className={classes.root}
                        onClick={() => onDelete(row.id)}
                        aria-label="delete"
                        data-cy="deleteButtonEditableTable"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </span>
                  )}
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default EditableTable;
