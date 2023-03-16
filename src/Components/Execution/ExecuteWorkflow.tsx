import useStore from '../../store/useStore';
import SendIcon from '@material-ui/icons/Send';
import IntegratedSpinner from '../General/IntegratedSpinner';
import ClearIcon from '@material-ui/icons/Clear';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import type { Event } from '../../types';
import { executeWorkflow } from '../../api/api';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import useSelectedElementStore from '../../store/useSelectedElementStore';

export const socket = io(process.env.REACT_APP_SERVER_URL as string);

export default function ExecuteWorkflow() {
  const graphRFDetails = useStore((state) => state.graphRFDetails);
  const recentGraphs = useStore((state) => state.recentGraphs);

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const inExecutionMode = useStore((state) => state.inExecutionMode);
  const setInExecutionMode = useStore((state) => state.setInExecutionMode);
  const setExecutedEvents = useStore((state) => state.setExecutedEvents);
  const canvasGraphChanged = useStore((state) => state.canvasGraphChanged);
  const setCanvasGraphChanged = useStore(
    (state) => state.setCanvasGraphChanged
  );
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const undoIndex = useStore((state) => state.undoIndex);
  const setSelectedElementNew = useSelectedElementStore(
    (state) => state.setSelectedElementNew
  );
  useEffect(() => {
    // DOC: when execution begins it has to listen to incoming from the socket events
    socket.on('Executing', (data: Event) => {
      setExecutedEvents(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [setExecutedEvents]);

  // TODO: check and execute same on ExecutionDetails... merge
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
    if (recentGraphs.length > 0 && !inExecutionMode) {
      setInExecutionMode(true);
      try {
        await executeWorkflow(graphRFDetails.id);
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
    } else if (inExecutionMode) {
      setInExecutionMode(false);
      // DOC: when exiting the execution to show the graph as selected
      // and not a numbered execution node that the user might have clicked
      setSelectedElementNew({ type: 'graph', id: graphRFDetails.id });
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
        {inExecutionMode ? <ClearIcon color="secondary" /> : <SendIcon />}
      </IntegratedSpinner>
    </>
  );
}
