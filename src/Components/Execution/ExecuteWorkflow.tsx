import useStore from '../../store/useStore';
import SendIcon from '@material-ui/icons/Send';
import IntegratedSpinner from '../General/IntegratedSpinner';
import io from 'socket.io-client';
import { useState } from 'react';

import { executeWorkflow } from '../../api/api';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { useNavigate } from 'react-router-dom';

export const socket = io(process.env.REACT_APP_SERVER_URL as string);

export default function ExecuteWorkflow(props: { id: string }) {
  const navigate = useNavigate();

  const recentGraphs = useStore((state) => state.recentGraphs);

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const canvasGraphChanged = useStore((state) => state.canvasGraphChanged);
  const setCanvasGraphChanged = useStore(
    (state) => state.setCanvasGraphChanged
  );
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);
  const undoIndex = useStore((state) => state.undoIndex);

  function checkAndExecute() {
    if (canvasGraphChanged && undoIndex !== 0) {
      setOpenAgreeDialog(true);
      return;
    }

    execute();
    setOpenAgreeDialog(false);
    setCanvasGraphChanged(false);
  }

  async function execute() {
    if (recentGraphs.length > 0) {
      try {
        await executeWorkflow(props.id);
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
      <IntegratedSpinner
        getting={false}
        tooltip="Execute Workflow and exit Execution mode"
        action={checkAndExecute}
        onClick={() => {
          // Keep logging in console for debugging when talking with a user
          /* eslint-disable no-console */
          console.log('Starting Execution');
        }}
      >
        <SendIcon />
      </IntegratedSpinner>
    </>
  );
}
