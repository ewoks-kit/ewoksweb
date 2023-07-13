import { Check, ErrorOutline, Save } from '@material-ui/icons';
import { useEffect } from 'react';
import type { Status } from './models';

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
  return <Icon />;
}

export default StatusIcon;
