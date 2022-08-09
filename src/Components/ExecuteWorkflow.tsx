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
  const setExecutedEvents = state((state) => state.setExecutedEvents);

  useEffect(() => {
    socket.on('Executing', (data) => {
      setExecutedEvents(data as Event);
    });

    return () => {
      socket.disconnect();
    };
  }, [setExecutedEvents]);

  const execute = async () => {
    if (recentGraphs.length > 0 && !inExecutionMode) {
      // if (socket.disconnected) {
      //   socket = io(process.env.REACT_APP_SERVER_URL);
      // }
      // socket.emit('Execute Graph', graphRF);
      setInExecutionMode(true);
      try {
        await executeWorkflow(graphRF.graph.id);
      } catch (error) {
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
