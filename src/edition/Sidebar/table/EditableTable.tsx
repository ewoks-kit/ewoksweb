import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';

import useSnackbarStore from '../../../store/useSnackbarStore';
import type { InputTableRow, RowValue, TypeOfValues } from '../../../types';
import { RowType } from '../../../types';
import AddEntryRow from './controls/AddEntryRow';
import RemoveRowCell from './controls/RemoveRowCell';
import TypeSelectCell from './controls/TypeSelectCell';
import MultiTypeEditCell from './MultiTypeEditCell';
import StrOrNumEditCell from './StrOrNumEditCell';
import styles from './Table.module.css';
import TableHeader from './TableHeader';

interface EditableTableProps {
  headers: string[];
  defaultValues: InputTableRow[];
  typeOfValues: TypeOfValues[];
  valuesChanged: (rows: InputTableRow[]) => void;
  disable?: boolean;
  onRowAdd?: (rows: InputTableRow[]) => void;
}

// The table where lines can be added where type is selected and appropriate values are given to name and value.
function EditableTable(props: EditableTableProps) {
  const { defaultValues: rows, headers, disable, onRowAdd } = props;

  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);

  function handleNameChange(newName: string | number, row: InputTableRow) {
    const { rowId: id } = row;
    const otherRows = rows.filter((_row) => _row.rowId !== id);

    if (otherRows.map((r) => r.name).includes(newName)) {
      showErrorMsg('Not allowed to assign the same property TWICE!');
    }

    const newRows = rows.map((rowe) => {
      if (rowe.rowId === id) {
        return { ...rowe, name: newName };
      }
      return rowe;
    });
    props.valuesChanged(newRows);
  }

  function handleValueChange(newValue: RowValue, row: InputTableRow) {
    const { rowId: id } = row;

    const newRows = rows.map((rowe) => {
      if (rowe.rowId === id) {
        return { ...rowe, value: newValue };
      }
      return rowe;
    });
    props.valuesChanged(newRows);
  }

  function onDelete(id: string) {
    const newRows = rows.filter((row) => {
      return row.rowId !== id;
    });

    props.valuesChanged(newRows);
  }

  function handleRowTypeChange(newType: RowType, row: InputTableRow) {
    const { rowId } = row;

    const newRows = rows.map((rowe) => {
      if (rowe.rowId === rowId) {
        return {
          ...rowe,
          value: newType === RowType.Null ? null : '',
          type: newType,
        };
      }
      return rowe;
    });

    props.valuesChanged(newRows);
  }

  return (
    <Table
      style={{ opacity: disable ? '0.2' : '1' }}
      className={styles.table}
      aria-label="editable table"
      size="small"
      padding="none"
    >
      <TableHeader headers={headers} />
      <TableBody>
        {rows.map((row) => {
          const hasDuplicateName =
            rows.filter((ro) => ro.name === row.name).length > 1;
          return (
            <TableRow key={row.rowId}>
              <StrOrNumEditCell
                value={row.name}
                isInvalid={hasDuplicateName}
                onChange={(newName) => handleNameChange(newName, row)}
                typeOfValues={props.typeOfValues[0]}
                disable={disable}
                width="30%"
                ariaLabel="Edit input name"
              />

              <TypeSelectCell
                value={row.type}
                onChange={(e) => handleRowTypeChange(e, row)}
                disable={disable}
              />

              <MultiTypeEditCell
                row={row}
                onChange={(newValue) => handleValueChange(newValue, row)}
                disable={disable || row.type === RowType.Null}
              />

              <RemoveRowCell
                disable={disable}
                onDelete={() => onDelete(row.rowId)}
              />
            </TableRow>
          );
        })}
        {onRowAdd && !disable && (
          <AddEntryRow onClick={() => onRowAdd(rows)} colSpan={4} />
        )}
      </TableBody>
    </Table>
  );
}

export default EditableTable;
