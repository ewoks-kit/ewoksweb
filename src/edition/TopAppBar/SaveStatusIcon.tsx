import { Check, ErrorOutline, Save } from '@mui/icons-material';
import { useEffect } from 'react';

import type { Status } from './models';
import styles from './SaveToServerButton.module.css';

interface Props {
  status: Status;
  setStatus: (s: Status) => void;
  children?: React.ReactNode;
}

const ICONS = {
  idle: Save,
  success: Check,
  error: ErrorOutline,
};

function SaveStatusIcon(props: Props) {
  const { status, setStatus, children } = props;

  // Restore idle status after 1s
  useEffect(() => {
    if (status === 'idle') {
      return undefined;
    }
    const t = setTimeout(() => setStatus('idle'), 1000);
    return () => clearTimeout(t);
  }, [status, setStatus]);

  const Icon = ICONS[status];
  return (
    <div className={styles.icon}>
      <Icon />
      {children}
    </div>
  );
}

export default SaveStatusIcon;
