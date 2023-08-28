import useStore from '../../../store/useStore';
import SendIcon from '@material-ui/icons/Send';
import { useState } from 'react';
import { executeWorkflow } from '../../../api/workflows';
import ConfirmDialog from '../../../general/ConfirmDialog';
import ActionMenuItem from './ActionMenuItem';
import { useNavigate } from 'react-router-dom';

function ExecutionMenuItem() {
  const showWarningMsg = useStore((state) => state.showWarningMsg);
  const showErrorMsg = useStore((state) => state.showErrorMsg);
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);

  const navigate = useNavigate();

  function checkAndExecute() {
    execute();
    setOpenAgreeDialog(false);
  }

  async function execute() {
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

  return (
    <>
      <ActionMenuItem
        icon={SendIcon}
        label="Execute workflow"
        onClick={checkAndExecute}
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
