import TableCell from '@mui/material/TableCell';

import type {
  InputTableRow,
  RowChangeEvent,
  TypeOfValues,
} from '../../../types';
import styles from './CustomTableCell.module.css';
import TableCellInEditMode from './TableCellInEditMode';

function isRowContentInvalid(
  row: InputTableRow,
  rowNames: string[] | undefined,
  usedIn?: 'DataMapping' | 'DefaultInputs' | 'Conditions',
) {
  const forEditableTableDuplicateName =
    usedIn !== 'DataMapping' &&
    rowNames !== undefined &&
    rowNames.filter((ro) => ro === row.name).length > 1;

  return !row.name || forEditableTableDuplicateName;
}

interface Props {
  row: InputTableRow;
  rowsNames?: string[];
  usedIn?: 'DataMapping' | 'DefaultInputs' | 'Conditions';
  disable?: boolean;
  typeOfValues?: TypeOfValues;
  onChange: (e: RowChangeEvent) => void;
  width?: string;
}

function NameTableCell(props: Props) {
  const { row, rowsNames, usedIn, disable, typeOfValues, onChange, width } =
    props;

  return (
    <TableCell
      align="left"
      className={styles.cell}
      data-disabled={disable ? '' : undefined}
      data-invalid={
        isRowContentInvalid(row, rowsNames, usedIn) ? '' : undefined
      }
      style={{
        width,
      }}
    >
      <TableCellInEditMode
        row={row}
        name="name"
        onChange={onChange}
        typeOfValues={typeOfValues}
        usedIn={usedIn}
        disable={disable}
      />
    </TableCell>
  );
}

export default NameTableCell;
