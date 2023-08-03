import { CircularProgress } from '@material-ui/core';
import { Replay } from '@material-ui/icons';
import { useState } from 'react';
import { executeWorkflow } from '../api/workflows';
import useStore from '../store/useStore';

import styles from './RerunButton.module.css';

interface Props {
  id: string;
}

function RerunButton(props: Props) {
  const { id } = props;

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const [loading, setLoading] = useState(false);

  return (
    <button
      className={styles.button}
      type="button"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={async () => {
        setLoading(true);
        try {
          await executeWorkflow(id);
        } catch {
          setOpenSnackbar({
            open: true,
            text: 'Execution could not start!',
            severity: 'error',
          });
        } finally {
          setLoading(false);
        }
      }}
      aria-label="Rerun workflow"
    >
      {loading ? <CircularProgress size="1em" /> : <Replay />}
    </button>
  );
}

export default RerunButton;
