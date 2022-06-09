import React, { useEffect } from 'react';
import IntegratedSpinner from './IntegratedSpinner';
import { rfToEwoks } from '../utils';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import type { GraphRF } from '../types';
import state from '../store/state';
import configData from '../configData.json';
import FormDialog from './FormDialog';
import curateGraph from '../utils/curateGraph';
import { getWorkflowsIds, postWorkflow, putWorkflow } from '../utils/api';

// DOC: Save to server button with its spinner
export default function SaveToServer({ saveToServerF }) {
  const setGettingFromServer = state((st) => st.setGettingFromServer);
  // const setGettingFromServer = state((state) => {
  //   return state.setGettingFromServer;
  // });
  const graphRF = state((state) => state.graphRF);
  const allWorkflows = state((state) => state.allWorkflows);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const setRecentGraphs = state((state) => state.setRecentGraphs);
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const [openSaveDialog, setOpenSaveDialog] = React.useState<boolean>(false);

  useEffect(() => {
    saveToServerF.current = saveToServer;
  });

  const workflowExists = (id, workflowsIds) => {
    console.log(id, allWorkflows);
    return workflowsIds.includes(id);
  };

  const saveToServer = async () => {
    // DOC: Remove empty lines if any in DataMapping, Conditions, DefaultValues
    // and Nodes DataMapping before attempting to save
    const graphRFCurrated = curateGraph(graphRF);
    // DOC: search if id exists. If notExists open dialog for new name.
    // If exists
    const workflowsIds = await getWorkflowsIds();
    setGettingFromServer(true);
    if (!workflowExists(graphRF.graph.id, workflowsIds)) {
      setOpenSaveDialog(true);
      if (!graphRF.graph.label || graphRF.graph.label === 'newGraph') {
        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: 'Please insert a new name for the new workflow and then save!',
          severity: 'warning',
        });
        return;
      }
      const newIdGraph = {
        graph: { ...graphRF.graph, id: graphRF.graph.label },
        nodes: graphRFCurrated.nodes,
        links: graphRFCurrated.links,
      };
      try {
        const postResponse = await postWorkflow(rfToEwoks(newIdGraph));
        setGettingFromServer(false);
        setWorkingGraph(postResponse.data as GraphRF);
        setRecentGraphs({} as GraphRF, true);
        setOpenSnackbar({
          open: true,
          text: 'Graph saved succesfully!',
          severity: 'success',
        });
      } catch (error) {
        setOpenSnackbar({
          open: true,
          text: error.response?.data?.message || configData.savingError,
          severity: 'error',
        });
      }
    } else if (graphRF.graph.id) {
      try {
        await putWorkflow(rfToEwoks(graphRFCurrated));
        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: 'Graph saved succesfully!',
          severity: 'success',
        });
      } catch (error) {
        setOpenSnackbar({
          open: true,
          text: error.response?.data?.message || configData.savingError,
          severity: 'error',
        });
      }
    } else {
      setOpenSnackbar({
        open: true,
        text: 'No graph exists to save!',
        severity: 'warning',
      });
    }
  };

  return (
    <>
      <FormDialog
        elementToEdit={graphRF}
        action="cloneGraph"
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
      />
      <IntegratedSpinner
        tooltip="Save to Server"
        action={() => null}
        getting={false}
        onClick={saveToServer}
      >
        <CloudUploadIcon />
      </IntegratedSpinner>
    </>
  );
}
