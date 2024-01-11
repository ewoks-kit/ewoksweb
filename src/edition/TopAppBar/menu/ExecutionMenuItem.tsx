import SendIcon from '@mui/icons-material/Send';
import { useKeyboardEvent } from '@react-hookz/web';
import { useState } from 'react';

import ExecuteParametersDialog from '../ExecuteParametersDialog';
import ActionMenuItem from './ActionMenuItem';

function ExecutionMenuItem() {
  const [open, setOpen] = useState(false);

  useKeyboardEvent(
    (e) =>
      (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'x',
    (e) => {
      e.preventDefault();
      setOpen(true);
    },
    [],
  );

  return (
    <>
      <ExecuteParametersDialog open={open} onClose={() => setOpen(false)} />
      <ActionMenuItem
        icon={SendIcon}
        label="Execute workflow"
        onClick={() => setOpen(true)}
      />
    </>
  );
}

export default ExecutionMenuItem;
