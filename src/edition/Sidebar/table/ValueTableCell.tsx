import TableCell from '@mui/material/TableCell';

import type {
  InputTableRow,
  RowChangeEvent,
  TypeOfValues,
} from '../../../types';
import EditJsonButton from './controls/EditJsonButton';
import styles from './CustomTableCell.module.css';
import TableCellInEditMode from './TableCellInEditMode';

interface Props {
  row: InputTableRow;
  typeOfValues?: TypeOfValues;
  disable?: boolean;
  onChange: (e: RowChangeEvent) => void;
  allowBoolAndNumberInputs?: boolean;
}

function ValueTableCell(props: Props) {
  const { row, disable, onChange, typeOfValues, allowBoolAndNumberInputs } =
    props;

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
