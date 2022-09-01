import { useState } from 'react';

import IntegratedSpinner from '../Components/IntegratedSpinner';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import type { GraphEwoks } from '../types';
import state from '../store/state';
import { getWorkflow } from '../utils/api';
import ConfirmDialog from './ConfirmDialog';

export default function GetFromServerButtons(props) {
  const { workflowId, showButtons } = props;

  const setSubGraph = state((state) => state.setSubGraph);
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const [gettingFromServer, setGettingFromServer] = useState(false);
  const graphRF = state((state) => state.graphRF);
  const canvasGraphChanged = state((state) => state.canvasGraphChanged);
  const setCanvasGraphChanged = state((state) => state.setCanvasGraphChanged);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const undoIndex = state((state) => state.undoIndex);

  const getSubgraphFromServer = () => {
    getFromServer('subgraph');
  };

  const checkAndGetFromServer = (isSubgraph) => {
    if (
      workflowId &&
      graphRF.graph.id &&
      graphRF.graph.id !== workflowId &&
      canvasGraphChanged &&
      undoIndex !== 0
    ) {
      setOpenAgreeDialog(true);
    } else {
      getFromServer(isSubgraph);
    }
  };

  const disAgreeSaveWithout = () => {
    setOpenAgreeDialog(false);
  };

  const getFromServer = async (isSubgraph) => {
    setOpenAgreeDialog(false);
    if (workflowId) {
      setGettingFromServer(true);
      try {
        const response = await getWorkflow(workflowId);
        if (response.data) {
          const graph = response.data as GraphEwoks;
          // setCallSuccess(true);
          setOpenSnackbar({
            open: true,
            text: `Workflow ${graph.graph.label} was downloaded succesfully`,
            severity: 'success',
          });
          setCanvasGraphChanged(false);
          if (isSubgraph === 'subgraph') {
            setSubGraph(graph);
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
      <ConfirmDialog
        title="There are unsaved changes"
        content="Continue without saving?"
        open={openAgreeDialog}
        agreeCallback={getFromServer}
        disagreeCallback={disAgreeSaveWithout}
      />
      {showButtons[0] && (
        <IntegratedSpinner
          // callSuccess={callSuccess}
          getting={gettingFromServer}
          tooltip="Open from Server"
          action={checkAndGetFromServer}
          onClick={() => {
            /* eslint-disable no-console */
            console.log('Getting from server');
          }}
        >
          <CloudDownloadIcon />
        </IntegratedSpinner>
      )}
      {showButtons[1] && (
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
      )}
    </>
  );
}
