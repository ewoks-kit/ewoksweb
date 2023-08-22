import useStore from '../../../store/useStore';
import SendIcon from '@material-ui/icons/Send';
import { useState } from 'react';
import { executeWorkflow } from '../../../api/workflows';
import ConfirmDialog from '../../../general/ConfirmDialog';
import ActionMenuItem from './ActionMenuItem';
import { useNavigate } from 'react-router-dom';
import ExecuteParametersDialog from '../ExecuteParametersDialog';
import type { ExecutionParams } from '../ExecuteParametersDialog';

function ExecutionMenuItem() {
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  function checkAndExecute() {
    setOpenAgreeDialog(true);
  }

  async function execute(params: ExecutionParams) {
    const { recentGraphs, workingGraph } = useStore.getState();
    if (recentGraphs.length === 0) {
      setOpenSnackbar({
        open: true,
        text: 'Please open a workflow in the canvas to execute',
        severity: 'warning',
      });
      return;
    }
    try {
      await executeWorkflow(workingGraph.graph.id);
      navigate('/monitor');
    } catch (error) {
      // Keep logging in console for debugging when talking with a user
      /* eslint-disable no-console */
      console.log(error);
      setOpenSnackbar({
        open: true,
        text: 'Execution could not start!',
        severity: 'error',
      });
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
