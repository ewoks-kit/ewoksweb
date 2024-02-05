import TableCell from '@mui/material/TableCell';

import type { InputTableRow, RowChangeEvent } from '../../../types';
import EditJsonButton from './controls/EditJsonButton';
import MultiTypeEditControl from './controls/MultiTypeEditControl';
import styles from './CustomTableCell.module.css';

interface Props {
  row: InputTableRow;
  disable?: boolean;
  onChange: (e: RowChangeEvent) => void;
}

function MultiTypeEditCell(props: Props) {
  const { row, disable, onChange } = props;

  const { value, type } = row;

  return (
    <TableCell
      align="left"
      className={styles.cell}
      data-disabled={disable ? '' : undefined}
      data-invalid={value === undefined || value === '' ? '' : undefined}
      style={{
        width: '50%',
      }}
    >
      {type === 'list' || type === 'dict' ? (
        <EditJsonButton
          value={value}
          type={type}
          onChange={(newValue) =>
            // @ts-expect-error
            onChange({ target: { name: 'value', value: newValue } })
          }
          disabled={disable}
        />
      ) : (
        <MultiTypeEditControl
          row={row}
          name="value"
          onChange={onChange}
          disable={disable}
        />
      )}
    </TableCell>
  );
}

export default MultiTypeEditCell;
