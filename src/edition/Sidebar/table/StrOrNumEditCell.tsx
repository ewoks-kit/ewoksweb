import TableCell from '@mui/material/TableCell';

import type { TypeOfValues } from '../../../types';
import StrOrNumEditControl from './controls/StrOrNumEditControl';
import styles from './CustomTableCell.module.css';

interface Props {
  value: string | number;
  onChange: (newValue: string | number) => void;
  isInvalid?: boolean;
  disable?: boolean;
  typeOfValues?: TypeOfValues;
  width?: string;
  ariaLabel?: string;
}

function StrOrNumEditCell(props: Props) {
  const {
    value,
    onChange,
    isInvalid,
    disable,
    typeOfValues,
    width,
    ariaLabel,
  } = props;

  return (
    <TableCell
      align="left"
      className={styles.cell}
      data-disabled={disable ? '' : undefined}
      data-invalid={value === '' || isInvalid ? '' : undefined}
      style={{
        width,
      }}
    >
      <StrOrNumEditControl
        value={value}
        onChange={onChange}
        typeOfValues={typeOfValues}
        disable={disable}
        ariaLabel={ariaLabel}
      />
    </TableCell>
  );
}

export default StrOrNumEditCell;
