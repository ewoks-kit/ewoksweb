import { useState, useCallback } from 'react';
import state from '../store/state';
import type { GraphEwoks } from '../types';
import { getWorkflow } from '../utils/api';

const useGetWorkflow = async (isSubgraph) => {
  const [workflowId, setWorkflowId] = useState('');
  const setSubGraph = state((state) => state.setSubGraph);
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const [gettingFromServer, setGettingFromServer] = useState(false);

  return new Promise((resolve, reject) => {
    setGettingFromServer(true);

    getWorkflow(workflowId)
      .then((response) => {
        if (response.data) {
          const graph = response.data as GraphEwoks;
          // setCallSuccess(true);
          setOpenSnackbar({
            open: true,
            text: `Workflow ${graph.graph.label} was downloaded succesfully`,
            severity: 'success',
          });
          if (isSubgraph === 'subgraph') {
            setSubGraph(graph);
          } else {
            setWorkingGraph(graph, 'fromServer');
          }
          return resolve(graph);
        } else {
          setOpenSnackbar({
            open: true,
            text:
              'Could not locate the requested workflow! Maybe it is deleted!',
            severity: 'warning',
          });
          return reject(new Error('something bad happened'));
        }
      })
      .catch((error) => {
        setOpenSnackbar({
          open: true,
          text:
            error.response?.data?.message ||
            'Error in retrieving workflow. Please check connectivity with the server!',
          severity: 'error',
        });
        return reject(new Error('something bad happened'));
      });
  });
};

export default useGetWorkflow;
