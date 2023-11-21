import SendIcon from '@mui/icons-material/Send';
import { useKeyboardEvent } from '@react-hookz/web';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { executeWorkflow } from '../../../api/workflows';
import ConfirmDialog from '../../../general/ConfirmDialog';
import useSnackbarStore from '../../../store/useSnackbarStore';
import useStore from '../../../store/useStore';
import ActionMenuItem from './ActionMenuItem';

function ExecutionMenuItem() {
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);

  const navigate = useNavigate();

  function checkAndExecute() {
    execute();
    setOpenAgreeDialog(false);
  }

  async function execute() {
    const { rootWorkflowId } = useStore.getState();
    if (!rootWorkflowId) {
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

  useKeyboardEvent(
    (e) => (e.ctrlKey || e.metaKey) && e.key === 'r',
    (e) => {
      e.preventDefault();
      execute();
    },
    [],
  );

  return (
    <>
      <ActionMenuItem
        icon={SendIcon}
        label="Execute workflow"
        onClick={checkAndExecute}
        keyShortcut="ctrl+r"
      />
      <ConfirmDialog
        title="There are unsaved changes"
        content="Continue without saving?"
        open={openAgreeDialog}
        agreeCallback={execute}
        disagreeCallback={() => setOpenAgreeDialog(false)}
      />
    </>
  );
}

export default ExecutionMenuItem;
