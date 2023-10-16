import { TableCell } from '@mui/material';

import RemoveRowButton from './RemoveRowButton';
import styles from './RemoveRowCell.module.css';

export interface Props {
  disable?: boolean;
  onDelete: () => void;
}

function RemoveRowCell(props: Props) {
  const { disable, onDelete } = props;

  return (
    <TableCell className={styles.cell}>
      <RemoveRowButton disable={disable} onDelete={onDelete} />
    </TableCell>
  );
}

export default RemoveRowCell;
