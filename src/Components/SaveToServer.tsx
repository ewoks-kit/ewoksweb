import React from 'react';
import IntegratedSpinner from './IntegratedSpinner';

import axios from 'axios';
import { rfToEwoks } from '../utils';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import type { GraphEwoks, GraphRF } from '../types';
import state from '../store/state';
import configData from '../configData.json';

//console.log(state, state);
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
  const isExecuted = state((state) => state.isExecuted);

  React.useEffect(() => {
    saveToServerF.current = saveToServer;
  });

  const saveToServer = async () => {
    // DOC: Remove empty lines if any in DataMapping, Conditions, DefaultValues
    // and Nodes DataMapping before attempting to save
    const graphRFCurrated = { ...graphRF };
    for (const nod of graphRFCurrated.nodes) {
      if (
        nod.default_inputs &&
        nod.default_inputs.length > 1 &&
        nod.default_inputs[nod.default_inputs.length - 1].id === ''
      ) {
        nod.default_inputs.pop();
      }
      if (
        nod.default_error_attributes &&
        nod.default_error_attributes.data_mapping &&
        nod.default_error_attributes.data_mapping.length > 1 &&
        nod.default_error_attributes.data_mapping[
          nod.default_error_attributes.data_mapping.length - 1
        ].id === ''
      ) {
        nod.default_error_attributes.data_mapping.pop();
      }
    }
    for (const lin of graphRFCurrated.links) {
      if (
        lin.data.conditions &&
        lin.data.conditions.length > 1 &&
        lin.data.conditions[lin.data.conditions.length - 1].id === ''
      ) {
        lin.data.conditions.pop();
      }
      if (
        lin.data.data_mapping &&
        lin.data.data_mapping.length > 1 &&
        lin.data.data_mapping[lin.data.data_mapping.length - 1].id === ''
      ) {
        lin.data.data_mapping.pop();
      }
    }
    // DOC: If id: "newGraph" request label update and then POST with id=label
    // else PUT and replace existing on server
    setGettingFromServer(true);
    if (graphRF.graph.id === 'newGraph') {
      if (graphRF.graph.label === 'newGraph') {
        setOpenSnackbar({
          open: true,
          text:
            'In the "Edit Graph" Please insert a new label to be also used as an id for the new workflow and then save!',
          severity: 'error',
        });
        setGettingFromServer(false);
        return;
      }
      const newIdGraph = {
        graph: { ...graphRF.graph, id: graphRF.graph.label },
        nodes: graphRF.nodes,
        links: graphRF.links,
      };
      await axios
        .post(`${configData.serverUrl}/workflows`, rfToEwoks(newIdGraph))
        .then((res) => {
          setGettingFromServer(false);
          setWorkingGraph(res.data as GraphRF);
          setRecentGraphs({} as GraphRF, true);
        });
    } else if (graphRF.graph.id) {
      await axios
        .put(
          `${configData.serverUrl}/workflow/${graphRF.graph.id}`,
          rfToEwoks(graphRF)
        )
        .then((res) => setGettingFromServer(false));
    } else {
      setOpenSnackbar({
        open: true,
        text: 'No graph exists to save!',
        severity: 'warning',
      });
    }
  };

  return (
    <IntegratedSpinner
      tooltip="Save Workflow"
      action={() => null}
      getting={false}
    >
      <CloudUploadIcon onClick={saveToServer} />
    </IntegratedSpinner>
  );
}
