import state from '../store/state';
import SendIcon from '@material-ui/icons/Send';
import IntegratedSpinner from '../Components/IntegratedSpinner';
import ClearIcon from '@material-ui/icons/Clear';
import io from 'socket.io-client';
import { useEffect } from 'react';
import type { ExecutingEvent } from '../types';
import { executeWorkflow } from '../utils/api';

export const socket = io(process.env.REACT_APP_SERVER_URL);

export default function ExecuteWorkflow() {
  const graphRF = state((state) => state.graphRF);
  const recentGraphs = state((state) => state.recentGraphs);

  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const isExecuted = state((state) => state.isExecuted);
  const setIsExecuted = state((state) => state.setIsExecuted);
  const setExecutingEvents = state((state) => state.setExecutingEvents);

  useEffect(() => {
    // console.log('Executing');
    socket.on('Executing', (data) =>
      setExecutingEvents(data as ExecutingEvent)
    );
    socket.on('ewoks', (data) => setExecutingEvents(data as ExecutingEvent));
    return () => {
      socket.disconnect();
    };
  }, [setExecutingEvents]);

  const execute = async () => {
    console.log(socket);
    if (recentGraphs.length > 0 && !isExecuted) {
      if (socket.disconnected) {
        const socket = io(process.env.REACT_APP_SERVER_URL);
      }
      socket.emit('Execute Graph', graphRF);
      socket.on('Executing', (data) => console.log(data));
      setIsExecuted(true);
      const jobId = await executeWorkflow(graphRF.graph.id);
      console.log(jobId);
    } else if (isExecuted) {
      setIsExecuted(false);
      // socket.disconnect();
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please open a workflow in the canvas to execute',
        severity: 'warning',
      });
    }
  };

  return (
    <IntegratedSpinner
      getting={false}
      tooltip="Execute Workflow and exit Execution mode"
      action={execute}
      onClick={() => {
        /* eslint-disable no-console */
        console.log('Starting Execution');
      }}
    >
      {isExecuted ? <ClearIcon color="secondary" /> : <SendIcon />}
    </IntegratedSpinner>
  );
}
