import { FiberNew } from '@material-ui/icons';
import { useKeyboardEvent } from '@react-hookz/web';
import { useCallback, useState } from 'react';

import ConfirmDialog from '../../../general/ConfirmDialog';
import useCurrentWorkflowIdStore from '../../../store/useCurrentWorkflowId';
import ActionMenuItem from './ActionMenuItem';

function OpenNewWorkflowMenuItem() {
  const [openDialog, setOpenDialog] = useState(false);

  const resetWorkflowId = useCurrentWorkflowIdStore((state) => state.resetId);

  const openEmptyWorkflow = useCallback(() => {
    resetWorkflowId();
  }, [resetWorkflowId]);

  useKeyboardEvent(
    (e) =>
      (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n',
    (e) => {
      e.preventDefault();
      setOpenDialog(true);
    },
    []
  );

  return (
    <>
      <ConfirmDialog
        title="Open a new workflow"
        content="All unsaved modifications will be lost. Continue?"
        open={openDialog}
        agreeCallback={openEmptyWorkflow}
        disagreeCallback={() => setOpenDialog(false)}
      />
      <ActionMenuItem
        icon={FiberNew}
        label="New workflow"
        onClick={() => setOpenDialog(true)}
      />
    </>
  );
}

export default OpenNewWorkflowMenuItem;
