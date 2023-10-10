import { RemoveCircleOutline } from '@mui/icons-material';
import { IconButton, TableCell } from '@mui/material';

import styles from './ToolsCell.module.css';

interface Props {
  disable?: boolean;
  onDelete: () => void;
}

function ToolsCell(props: Props) {
  const { disable, onDelete } = props;

  return (
    <TableCell className={styles.cell}>
      <IconButton
        className={styles.button}
        disabled={disable}
        aria-label="Remove row"
        onClick={() => onDelete()}
        size="large"
      >
        <RemoveCircleOutline
          className={styles.icon}
          htmlColor="#rgb(108, 128, 236)"
        />
      </IconButton>
    </TableCell>
  );
}

export default ToolsCell;
