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
  InputTableRow,
  RowChangeEvent,
  TypeOfValues,
} from 'types';

import DraggableDialog from '../../../general/DraggableDialog';
import useSnackbarStore from '../../../store/useSnackbarStore';
import AddEntryRow from './controls/AddEntryRow';
import RemoveRowCell from './controls/RemoveRowCell';
import TypeSelectCell from './controls/TypeSelectCell';
import NameTableCell from './NameTableCell';
import styles from './Table.module.css';
import TableHeader from './TableHeader';
import { createData, getType } from './utils';
import ValueTableCell from './ValueTableCell';

interface EditableTableProps {
  headers: string[];
  defaultValues: Condition[] | DefaultInput[];
  typeOfValues: TypeOfValues[];
  disable?: boolean;
  valuesChanged: (rows: InputTableRow[]) => void;
  onRowAdd?: (rows?: InputTableRow[]) => void;
}

interface DialogContent {
  id: string;
  title: string;
  object: object;
  callbackProps: { rows: InputTableRow[]; id: string };
}

// The table where lines can be added where type is selected and appropriate values are given to name and value.
function EditableTable(props: EditableTableProps) {
  const { defaultValues, headers, disable, onRowAdd } = props;

  const [rows, setRows] = React.useState<InputTableRow[]>([]);
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
    callbackProps: { rows: InputTableRow[]; id: string },
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

  function calcNewRows(rowId: string | undefined): InputTableRow[] {
    return rows.map((row) => {
      if (row.rowId === rowId) {
        return {
          ...row,
          rowId: row.name?.toString() || '',
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

  function onChange(e: RowChangeEvent, row: InputTableRow, index: number) {
    const { rowId: id } = row;
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
        if (rowe.rowId === id) {
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
      if (rowTable.rowId === id) {
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
      return row.rowId !== id;
    });

    setRows(newRows);
    props.valuesChanged(newRows);
  }

  const changedTypeOfInputs = (
    e: ChangeEvent<HTMLInputElement>,
    row: InputTableRow,
    index: number,
  ) => {
    const { rowId = '' } = row;

    const newRows = rows.map((rowe) => {
      if (rowe.rowId === rowId) {
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
    callbackProps: { id: string; rows: InputTableRow[] },
  ) {
    const newRows = callbackProps.rows.map((row) => {
      if (row.rowId === callbackProps.id) {
        return name !== ''
          ? { ...row, rowId: name, value: val }
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
          {rows.map((row, index) => {
            const handleChange = (evt: RowChangeEvent) =>
              onChange(evt, row, index);
            return (
              <React.Fragment key={row.rowId}>
                <TableRow>
                  <NameTableCell
                    row={row}
                    rowsNames={rows.map((ro) => ro.name?.toString() || '')}
                    onChange={handleChange}
                    typeOfValues={props.typeOfValues[0]}
                    disable={disable}
                    width="30%"
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

                  <ValueTableCell
                    row={row}
                    onChange={handleChange}
                    onEdit={() => onEditRow(row.rowId || '', index)}
                    disable={disable}
                  />

                  <RemoveRowCell
                    disable={disable}
                    onDelete={() => onDelete(row.rowId || '')}
                  />
                </TableRow>
              </React.Fragment>
            );
          })}
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
