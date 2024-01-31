import { EditOutlined as EditIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
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
  typeOfValues?: TypeOfValues;
  disable?: boolean;
  onEdit?: () => void;
  onChange: (e: RowChangeEvent) => void;
  allowBoolAndNumberInputs?: boolean;
}

function ValueTableCell(props: Props) {
  const {
    row,
    disable,
    onEdit,
    onChange,
    typeOfValues,
    allowBoolAndNumberInputs,
  } = props;

  const { value } = row;

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
      {row.type && ['dict', 'list', 'object'].includes(row.type) ? (
        <span className={styles.icon}>
          {value && typeof value === 'object' ? JSON.stringify(value) : ''}

          <IconButton
            disabled={disable}
            size="small"
            aria-label="edit"
            onClick={() => {
              onEdit?.();
            }}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </span>
      ) : (
        <TableCellInEditMode
          row={row}
          name="value"
          onChange={onChange}
          typeOfValues={typeOfValues}
          disable={disable}
          allowBoolAndNumberInputs={allowBoolAndNumberInputs}
        />
      )}
    </TableCell>
  );
}

export default ValueTableCell;
