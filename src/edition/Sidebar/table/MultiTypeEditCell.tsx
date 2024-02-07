import TableCell from '@mui/material/TableCell';

import type { RowType, RowValue } from '../../../types';
import MultiTypeEditControl from './controls/MultiTypeEditControl';
import styles from './CustomTableCell.module.css';

interface Props {
  value: unknown;
  type: RowType;
  onChange: (newValue: RowValue) => void;
  disable?: boolean;
}

function MultiTypeEditCell(props: Props) {
  const { value, type, disable, onChange } = props;

  if (
    typeof value !== 'string' &&
    typeof value !== 'object' &&
    typeof value !== 'boolean' &&
    typeof value !== 'number'
  ) {
    throw new TypeError(
      `Expected string, object, boolean or number. Got ${typeof value} instead.`,
    );
  }

  return (
    <TableCell
      align="left"
      className={styles.cell}
      data-disabled={disable ? '' : undefined}
      data-invalid={value === '' ? '' : undefined}
      style={{
        width: '50%',
      }}
    >
      <MultiTypeEditControl
        value={value}
        type={type}
        onChange={onChange}
        disable={disable}
      />
    </TableCell>
  );
}

export default MultiTypeEditCell;
