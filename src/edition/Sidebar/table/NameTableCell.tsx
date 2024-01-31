import TableCell from '@mui/material/TableCell';

import type {
  InputTableRow,
  RowChangeEvent,
  TypeOfValues,
} from '../../../types';
import styles from './CustomTableCell.module.css';
import TableCellInEditMode from './TableCellInEditMode';

interface Props {
  row: InputTableRow;
  onChange: (e: RowChangeEvent) => void;
  isInvalid?: boolean;
  disable?: boolean;
  typeOfValues?: TypeOfValues;
  width?: string;
}

function NameTableCell(props: Props) {
  const { row, onChange, isInvalid, disable, typeOfValues, width } = props;

  return (
    <TableCell
      align="left"
      className={styles.cell}
      data-disabled={disable ? '' : undefined}
      data-invalid={!row.name || isInvalid ? '' : undefined}
      style={{
        width,
      }}
    >
      <TableCellInEditMode
        row={row}
        name="name"
        onChange={onChange}
        typeOfValues={typeOfValues}
        disable={disable}
      />
    </TableCell>
  );
}

export default NameTableCell;
