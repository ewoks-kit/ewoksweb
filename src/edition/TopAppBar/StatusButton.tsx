import { Check, ErrorOutline, Save } from '@mui/icons-material';
import { useEffect } from 'react';

import { useIsChanged } from '../../store/graph-hooks';
import type { Status } from './models';
import styles from './TopAppBar.module.css';

interface Props {
  status: Status;
  setStatus: (s: Status) => void;
}

const ICONS = {
  idle: Save,
  success: Check,
  error: ErrorOutline,
};

function StatusIcon(props: Props) {
  const { status, setStatus } = props;

  // Restore idle status after 1s
  useEffect(() => {
    if (status === 'idle') {
      return;
    }
    const t = setTimeout(() => setStatus('idle'), 1000);
    // eslint-disable-next-line consistent-return
    return () => clearTimeout(t);
  }, [status, setStatus]);

  const Icon = ICONS[status];
  return (
    <div className={styles.container}>
      <Icon />
      {useIsChanged() && <div className={styles.saveRedDot} />}
    </div>
  );
}

export default StatusIcon;
