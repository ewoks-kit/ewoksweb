import { FiberNew } from '@mui/icons-material';
import { useKeyboardEvent } from '@react-hookz/web';
import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ConfirmDialog from '../../../general/ConfirmDialog';
import ActionMenuItem from './ActionMenuItem';

function OpenNewWorkflowMenuItem() {
  const [openDialog, setOpenDialog] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const openEmptyWorkflow = useCallback(() => {
    setOpenDialog(false);
    setSearchParams({});
  }, [setSearchParams]);

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
