import React from 'react';
import IntegratedSpinner from './IntegratedSpinner';
import useStore from '../store';
import axios from 'axios';
import { rfToEwoks } from '../utils';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import type { GraphEwoks, GraphRF } from '../types';

export default function SaveToServer({ saveToServerF }) {
  const setGettingFromServer = useStore((state) => state.setGettingFromServer);
  const graphRF = useStore((state) => state.graphRF);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);

  React.useEffect(() => {
    saveToServerF.current = saveToServer;
  });

  const saveToServer = async () => {
    // if id: newGraph request label update and the POST with id=label
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
        .post(`http://localhost:5000/workflows`, rfToEwoks(newIdGraph))
        .then((res) => {
          setGettingFromServer(false);
          setWorkingGraph(res.data as GraphEwoks);
          setRecentGraphs({} as GraphRF, true);
        });
    } else if (graphRF.graph.id) {
      await axios
        .put(
          `http://localhost:5000/workflow/${graphRF.graph.id}`,
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
