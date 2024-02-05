import TableCell from '@mui/material/TableCell';

import type {
  InputTableRow,
  RowChangeEvent,
  TypeOfValues,
} from '../../../types';
import StrEditControl from './controls/StrEditControl';
import styles from './CustomTableCell.module.css';

interface Props {
  row: InputTableRow;
  name: 'name' | 'value';
  onChange: (e: RowChangeEvent) => void;
  isInvalid?: boolean;
  disable?: boolean;
  typeOfValues?: TypeOfValues;
  width?: string;
}

function StrEditCell(props: Props) {
  const { row, name, onChange, isInvalid, disable, typeOfValues, width } =
    props;

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
      <StrEditControl
        row={row}
        name={name}
        onChange={onChange}
        typeOfValues={typeOfValues}
        disable={disable}
      />
    </TableCell>
  );
}

export default StrEditCell;
