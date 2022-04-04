import React from 'react';
import IntegratedSpinner from './IntegratedSpinner';

import axios from 'axios';
import { rfToEwoks } from '../utils';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import type { GraphRF } from '../types';
import state from '../store/state';
import configData from '../configData.json';
import FormDialog from './FormDialog';
import curateGraph from '../utils/curateGraph';

// DOC: Save to server button with its spinner
export default function SaveToServer({ saveToServerF }) {
  const setGettingFromServer = state((st) => st.setGettingFromServer);
  // const setGettingFromServer = state((state) => {
  //   return state.setGettingFromServer;
  // });
  const graphRF = state((state) => state.graphRF);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const setRecentGraphs = state((state) => state.setRecentGraphs);
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const [openSaveDialog, setOpenSaveDialog] = React.useState<boolean>(false);

  React.useEffect(() => {
    saveToServerF.current = saveToServer;
  });

  const saveToServer = async () => {
    // DOC: Remove empty lines if any in DataMapping, Conditions, DefaultValues
    // and Nodes DataMapping before attempting to save
    const graphRFCurrated = curateGraph(graphRF);
    // DOC: If id: "newGraph" request label update and then POST with id=label
    // else PUT and replace existing on server
    // TODO: following line creates issues on graph positionng examine
    setGettingFromServer(true);
    if (graphRF.graph.id === 'newGraph') {
      setOpenSaveDialog(true);
      if (!graphRF.graph.label || graphRF.graph.label === 'newGraph') {
        setOpenSnackbar({
          open: true,
          text:
            'Please insert a new label to be also used as an id for the new workflow and then save!',
          severity: 'warn',
        });
        setGettingFromServer(false);
        return;
      }
      const newIdGraph = {
        graph: { ...graphRF.graph, id: graphRF.graph.label },
        nodes: graphRFCurrated.nodes,
        links: graphRFCurrated.links,
      };
      await axios
        .post(`${configData.serverUrl}/workflows`, rfToEwoks(newIdGraph))
        .then((res) => {
          setGettingFromServer(false);
          setWorkingGraph(res.data as GraphRF);
          setRecentGraphs({} as GraphRF, true);
          setOpenSnackbar({
            open: true,
            text: 'Graph saved succesfully!',
            severity: 'success',
          });
        })
        .catch((
          error // console.log(error.response)
        ) =>
          setOpenSnackbar({
            open: true,
            text: error.response.data,
            severity: 'error',
          })
        );
    } else if (graphRF.graph.id) {
      await axios
        .put(
          `${configData.serverUrl}/workflow/${graphRF.graph.id}`,
          rfToEwoks(graphRFCurrated)
        )
        .then(() => {
          setGettingFromServer(false);
          setOpenSnackbar({
            open: true,
            text: 'Graph saved succesfully!',
            severity: 'success',
          });
        });
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
        tooltip="Save Workflow"
        action={() => null}
        getting={false}
      >
        <CloudUploadIcon onClick={saveToServer} />
      </IntegratedSpinner>
    </>
  );
}
