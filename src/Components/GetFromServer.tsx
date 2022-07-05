import React from 'react';

import DashboardStyle from '../layout/DashboardStyle';
import IntegratedSpinner from '../Components/IntegratedSpinner';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FormControl from '@material-ui/core/FormControl';
import AutocompleteDrop from '../Components/AutocompleteDrop';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import type { GraphEwoks, GraphRF } from '../types';
import state from '../store/state';
import { getWorkflow } from '../utils/api';

const useStyles = DashboardStyle;

export default function GetFromServer() {
  const classes = useStyles();

  const [workflowId, setWorkflowId] = React.useState('');
  const setSubGraph = state((state) => state.setSubGraph);
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const [gettingFromServer, setGettingFromServer] = React.useState(false);
  // const [callSuccess, setCallSuccess] = React.useState(false);
  // TODO replace with the following brakes the round spinner
  // const gettingFromServer = state((state) => state.gettingFromServer);
  // const setGettingFromServer = state((state) => state.setGettingFromServer);

  const getSubgraphFromServer = () => {
    getFromServer('subgraph');
  };

  const setInputValue = (workflowDetails) => {
    if (workflowDetails && workflowDetails.id) {
      setWorkflowId(workflowDetails.id || '');
    }
  };

  const getFromServer = async (isSubgraph) => {
    if (workflowId) {
      setGettingFromServer(true);
      try {
        const response = await getWorkflow(workflowId);
        if (response.data) {
          const graph = response.data as GraphRF;
          // setCallSuccess(true);
          setOpenSnackbar({
            open: true,
            text: `Workflow ${graph.graph.label} was downloaded succesfully`,
            severity: 'success',
          });
          if (isSubgraph === 'subgraph') {
            setSubGraph(response.data as GraphEwoks);
          } else {
            setWorkingGraph(graph, 'fromServer');
          }
        } else {
          setOpenSnackbar({
            open: true,
            text:
              'Could not locate the requested workflow! Maybe it is deleted!',
            severity: 'warning',
          });
        }
      } catch (error) {
        setOpenSnackbar({
          open: true,
          text:
            error.response?.data?.message ||
            'Error in retrieving workflow. Please check connectivity with the server!',
          severity: 'error',
        });
      } finally {
        setGettingFromServer(false);
      }
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please select a graph to fetch and re-click!',
        severity: 'warning',
      });
    }
  };

  return (
    <>
      <FormControl
        variant="standard"
        // TODO: remove if build problem is resolved
        style={{
          minWidth: '220px',
          backgroundColor: '#7685dd',
          borderRadius: '4px',
        }}
        className={classes.formControl}
      >
        <AutocompleteDrop
          setInputValue={setInputValue}
          placeholder="Workflows"
          category=""
        />
      </FormControl>
      <IntegratedSpinner
        // callSuccess={callSuccess}
        getting={gettingFromServer}
        tooltip="Open from Server"
        action={getFromServer}
        onClick={() => {
          /* eslint-disable no-console */
          console.log('Getting from server');
        }}
      >
        <CloudDownloadIcon />
      </IntegratedSpinner>
      <IntegratedSpinner
        getting={gettingFromServer}
        tooltip="Add workflow as subgraph"
        action={getSubgraphFromServer}
        onClick={() => {
          /* eslint-disable no-console */
          console.log('Getting subgraph from server');
        }}
      >
        <ArrowDownwardIcon />
      </IntegratedSpinner>
    </>
  );
}
