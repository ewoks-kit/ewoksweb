import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { executeWorkflow } from '../../../api/workflows';
import ConfirmDialog from '../../../general/ConfirmDialog';
import useSnackbarStore from '../../../store/useSnackbarStore';
import useStore from '../../../store/useStore';
import type { ExecutionParams } from '../ExecuteParametersDialog';
import ExecuteParametersDialog from '../ExecuteParametersDialog';
import ActionMenuItem from './ActionMenuItem';

function ExecutionMenuItem() {
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  function checkAndExecute() {
    setOpenAgreeDialog(true);
  }

  async function execute(params?: ExecutionParams) {
    const { loadedGraphs, rootWorkflowId } = useStore.getState();
    if (loadedGraphs.size === 0) {
      showWarningMsg('Please open a workflow in the canvas to execute');
      return;
    }
    try {
      await executeWorkflow(rootWorkflowId);
      navigate('/monitor');
    } catch (error) {
      // Keep logging in console for debugging when talking with a user
      /* eslint-disable no-console */
      console.log(error);
      showErrorMsg('Execution could not start!');
    }
  }

  function handleClose() {
    setOpen(false);
  }

  function handleAgree() {
    setOpenAgreeDialog(false);
    setOpen(true);
  }

  return (
    <>
      <ExecuteParametersDialog
        open={open}
        onClose={handleClose}
        executeWorkflow={execute}
      />
      <ActionMenuItem
        icon={SendIcon}
        label="Execute workflow"
        onClick={checkAndExecute}
      />
      <ConfirmDialog
        title="There are unsaved changes"
        content="Continue without saving?"
        open={openAgreeDialog}
        agreeCallback={handleAgree}
        disagreeCallback={() => setOpenAgreeDialog(false)}
      />
    </>
  );
}

export default ExecutionMenuItem;
