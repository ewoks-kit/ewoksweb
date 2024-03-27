import { FiberNew } from '@mui/icons-material';
import { useKeyboardEvent } from '@react-hookz/web';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ConfirmDialog from '../../../general/ConfirmDialog';
import useStore from '../../../store/useStore';
import ActionMenuItem from './ActionMenuItem';

function OpenNewWorkflowMenuItem() {
  const [openDialog, setOpenDialog] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );

  function openEmptyWorkflow() {
    setSearchParams({});
  }

  useKeyboardEvent(
    (e) =>
      (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n',
    (e) => {
      e.preventDefault();
      setOpenDialog(true);
    },
    [],
  );

  return (
    <>
      <ConfirmDialog
        title="Open a new workflow"
        content="All unsaved modifications will be lost. Continue?"
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={openEmptyWorkflow}
      />
      <ActionMenuItem
        icon={FiberNew}
        label="New workflow"
        onClick={() => displayedWorkflowInfo.id && setOpenDialog(true)}
        keyShortcut="Ctrl+Shift+N"
      />
    </>
  );
}

export default OpenNewWorkflowMenuItem;
