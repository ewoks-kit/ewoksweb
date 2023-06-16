import useStore from '../../../store/useStore';
import SendIcon from '@material-ui/icons/Send';
import { useState } from 'react';
import { executeWorkflow } from '../../../api/api';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import ActionMenuItem from './ActionMenuItem';

function ExecutionMenuItem() {
  const navigate = useNavigate();

  const recentGraphs = useStore((state) => state.recentGraphs);

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setCanvasGraphChanged = useStore(
    (state) => state.setCanvasGraphChanged
  );
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);
  const workingGraph = useStore((state) => state.workingGraph);

  function checkAndExecute() {
    execute();
    setOpenAgreeDialog(false);
    setCanvasGraphChanged(false);
  }

  async function execute() {
    if (recentGraphs.length > 0) {
      try {
        await executeWorkflow(workingGraph.graph.id);
        window.open('/#/monitor-workflows', '_blank');
        navigate('/monitor-workflows');
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
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please open a workflow in the canvas to execute',
        severity: 'warning',
      });
    }
  }

  function disAgreeSaveWithout() {
    setOpenAgreeDialog(false);
  }

  return (
    <>
      <ConfirmDialog
        title="There are unsaved changes"
        content="Continue without saving?"
        open={openAgreeDialog}
        agreeCallback={execute}
        disagreeCallback={disAgreeSaveWithout}
      />
      <ActionMenuItem
        icon={SendIcon}
        label="Execute workflow"
        onClick={checkAndExecute}
      />
    </>
  );
}

export default ExecutionMenuItem;
