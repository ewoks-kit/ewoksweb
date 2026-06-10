import { AddCircleOutlined } from '@mui/icons-material';
import { TableCell, TableRow } from '@mui/material';

import styles from './AddEntryRow.module.css';

interface Props {
  onClick: () => void;
  colSpan: number;
}

function AddEntryRow(props: Props) {
  const { onClick, colSpan } = props;

  return (
    <TableRow>
      <TableCell className={styles.cell} colSpan={colSpan}>
        <button
          className={styles.button}
          aria-label="Add entry"
          onClick={onClick}
          type="button"
        >
          Add
          <AddCircleOutlined />
        </button>
      </TableCell>
    </TableRow>
  );
}

export default AddEntryRow;
