import state from '../store/state';
import SendIcon from '@material-ui/icons/Send';
import IntegratedSpinner from '../Components/IntegratedSpinner';
import ClearIcon from '@material-ui/icons/Clear';
import io from 'socket.io-client';
import { useEffect } from 'react';
import type { Event } from '../types';
import { executeWorkflow } from '../utils/api';

export const socket = io(process.env.REACT_APP_SERVER_URL);

export default function ExecuteWorkflow() {
  const graphRF = state((state) => state.graphRF);
  const recentGraphs = state((state) => state.recentGraphs);

  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const inExecutionMode = state((state) => state.inExecutionMode);
  const setInExecutionMode = state((state) => state.setInExecutionMode);
  const setExecutingEvents = state((state) => state.setExecutingEvents);
  const setExecutedEvents = state((state) => state.setExecutedEvents);

  useEffect(() => {
    socket.on('Executing', (data) => {
      setExecutedEvents(data as Event);
    });

    return () => {
      socket.disconnect();
    };
  }, [setExecutingEvents, setExecutedEvents]);

  const execute = async () => {
    if (recentGraphs.length > 0 && !inExecutionMode) {
      // if (socket.disconnected) {
      //   socket = io(process.env.REACT_APP_SERVER_URL);
      // }
      socket.emit('Execute Graph', graphRF);
      /* eslint-disable no-console */
      // socket.on('Executing', (data) => console.log(data));
      setInExecutionMode(true);
      const jobId = await executeWorkflow(graphRF.graph.id);
      /* eslint-disable no-console */
      // console.log(jobId);
    } else if (inExecutionMode) {
      setInExecutionMode(false);
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
      {inExecutionMode ? <ClearIcon color="secondary" /> : <SendIcon />}
    </IntegratedSpinner>
  );
}
