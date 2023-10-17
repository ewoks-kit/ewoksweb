/*
  The table that is used to pass parameters for default-values, conditions and data-mapping.
  Its cells can change depending on the kind of input and the parent-component params.
*/
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import type { ChangeEvent } from 'react';
import { useEffect } from 'react';
import React from 'react';
import type {
  Condition,
  DefaultInput,
  EditableTableRow,
  TypeOfValues,
} from 'types';

import DraggableDialog from '../../../general/DraggableDialog';
import useSnackbarStore from '../../../store/useSnackbarStore';
import AddEntryRow from './controls/AddEntryRow';
import RemoveRowCell from './controls/RemoveRowCell';
import TypeSelectCell from './controls/TypeSelectCell';
import CustomTableCell from './CustomTableCell';
import styles from './Table.module.css';
import TableHeader from './TableHeader';
import { createData, getType } from './utils';

interface EditableTableProps {
  headers: string[];
  defaultValues: Condition[] | DefaultInput[];
  typeOfValues: TypeOfValues[];
  disable?: boolean;
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
  const { defaultValues, headers, disable, onRowAdd } = props;

  const [rows, setRows] = React.useState<EditableTableRow[]>([]);
  const [typeOfInputs, setTypeOfInputs] = React.useState<string[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogContent, setDialogContent] = React.useState<DialogContent>();
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);

  useEffect(() => {
    setTypeOfInputs(defaultValues.map(getType));
    setRows(defaultValues.map(createData));
  }, [defaultValues]);

  function showEditableDialog(
    id: string,
    title: string,
    graph: unknown,
    callbackProps: { rows: EditableTableRow[]; id: string },
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
        { rows, id },
      );
    }

    setRows(calcNewRows(id));
  }

  function onChange(
    e: { target: { name: string; value: string | number } },
    row: EditableTableRow,
    index: number,
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
        typeOfInputs[index],
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
    index: number,
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
    callbackProps: { id: string; rows: EditableTableRow[] },
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
        style={{ opacity: disable ? '0.2' : '1' }}
        className={styles.table}
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
                  disable={disable}
                />

                <TypeSelectCell
                  value={
                    typeOfInputs[index] !== 'boolean'
                      ? typeOfInputs[index]
                      : 'bool'
                  }
                  onChange={(e) => changedTypeOfInputs(e, row, index)}
                  disable={disable}
                />

                <CustomTableCell
                  index={index}
                  row={row}
                  name="value"
                  onChange={onChange}
                  onEdit={() => onEditRow(row.id || '', index)}
                  disable={disable}
                />
                <RemoveRowCell
                  disable={disable}
                  onDelete={() => onDelete(row.id || '')}
                />
              </TableRow>
            </React.Fragment>
          ))}
          {onRowAdd && !disable && (
            <AddEntryRow onClick={() => onRowAdd(rows)} colSpan={4} />
          )}
        </TableBody>
      </Table>
      {disable && (
        <div className={styles.warning}>
          Conditions have no effect when On Error condition is enabled. They
          will be removed when saving the workflow.
        </div>
      )}
    </>
  );
}

export default EditableTable;
