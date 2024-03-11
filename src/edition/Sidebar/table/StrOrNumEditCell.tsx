import TableCell from '@mui/material/TableCell';

import type { Options } from '../../../types';
import StrOrNumEditControl from './controls/StrOrNumEditControl';
import styles from './CustomTableCell.module.css';

interface Props {
  value: string | number;
  onChange: (newValue: string | number) => void;
  isInvalid?: boolean;
  disable?: boolean;
  options?: Options;
  width?: string;
  ariaLabel?: string;
}

function StrOrNumEditCell(props: Props) {
  const { value, onChange, isInvalid, disable, options, width, ariaLabel } =
    props;

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
        options={options}
        disable={disable}
        ariaLabel={ariaLabel}
      />
    </TableCell>
  );
}

export default StrOrNumEditCell;
