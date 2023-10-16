import { RemoveCircleOutline } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import type { Props } from './RemoveRowCell';
import styles from './RemoveRowCell.module.css';

function RemoveRowButton(props: Props) {
  const { disable, onDelete } = props;

  return (
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
  );
}

export default RemoveRowButton;
