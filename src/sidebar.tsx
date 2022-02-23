import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import AddNodes from './Components/AddNodes';
import EditElement from './Components/EditElement';
import EditElementStyle from './Components/EditElementStyle';
import DraggableDialog from './Components/DraggableDialog';
import IconMenu from './Components/IconMenu';
import Drawer from './Components/Drawer';
import axios from 'axios';
import ExecutionDetails from './Components/ExecutionDetails';
import DashboardStyle from './layout/DashboardStyle';
import state from './store/state';
import configData from './configData.json';

import type { EwoksRFNode, EwoksRFLink, GraphDetails, GraphRF } from './types';
import { rfToEwoks } from './utils';

const useStyles = DashboardStyle;

export default function Sidebar(props) {
  const classes = useStyles();

  const selectedElement = state<EwoksRFNode | EwoksRFLink>(
    (state) => state.selectedElement
  );
  const setSelectedElement = state((state) => state.setSelectedElement);

  const [element, setElement] = React.useState<EwoksRFNode | EwoksRFLink>(
    {} as EwoksRFNode | EwoksRFLink
  );
  const graphRF = state((state) => state.graphRF);
  const setGraphRF = state((state) => state.setGraphRF);
  const workingGraph = state((state) => state.workingGraph);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [dialogContent, setDialogContent] = React.useState({});
  const setSubgraphsStack = state((state) => state.setSubgraphsStack);
  const setRecentGraphs = state((state) => state.setRecentGraphs);
  const initializedGraph = state((state) => state.initializedGraph);
  const setUndoRedo = state((state) => state.setUndoRedo);
  const isExecuted = state((state) => state.isExecuted);

  useEffect(() => {
    // console.log(selectedElement);
    setElement(selectedElement);
  }, [selectedElement.id, selectedElement]);

  const defaultInputsChanged = (table) => {
    // setDefaultInputs(table);
    setElement({
      ...element,
      default_inputs: table.map((dval) => {
        return {
          id: dval.name,
          name: dval.name,
          value: dval.value,
        };
      }),
    });
  };

  const deleteElement = async () => {
    let newGraph = {} as GraphRF;
    const elN = element as EwoksRFNode; // TODO: is this the way typescript warning???
    const elL = element as EwoksRFLink;
    const elD = element as GraphDetails;
    if (elN.position) {
      // find associated links to delete
      const nodesLinks = graphRF.links.filter(
        (link) => !(link.source === elN.id || link.target === elN.id)
      );
      newGraph = {
        ...graphRF,
        nodes: graphRF.nodes.filter((nod) => nod.id !== element.id),
        links: nodesLinks,
      };
      setUndoRedo({
        action: 'Node deleted',
        graph: newGraph,
      });
    } else if (elL.source) {
      newGraph = {
        ...graphRF,
        links: graphRF.links.filter((link) => link.id !== elL.id),
      };
      setUndoRedo({
        action: 'Link deleted',
        graph: newGraph,
      });
    }

    if (elD.input_nodes && elD.id !== 'newGraph') {
      await axios
        .delete(`${configData.serverUrl}/workflow/${elD.id}`)
        .then(() => {
          setOpenSnackbar({
            open: true,
            text: `Workflow ${elD.id} succesfully deleted!`,
            severity: 'success',
          });
        })
        .catch((error) => {
          setOpenSnackbar({
            open: true,
            text: error.message,
            severity: 'error',
          });
        });
      setGraphRF(initializedGraph);
      setSelectedElement({} as GraphDetails);
      setSubgraphsStack({ id: 'initialiase', label: '' });
      setRecentGraphs({} as GraphRF, true);
    } else if (!elD.input_nodes) {
      if (workingGraph.graph.id === graphRF.graph.id) {
        setGraphRF(newGraph as GraphRF);
      } else {
        setOpenSnackbar({
          open: true,
          text: 'Not allowed to delete any element in a sub-graph!',
          severity: 'success',
        });
      }
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Nothing to delete!',
        severity: 'error',
      });
    }
  };

  const showEwoksGraph = () => {
    setOpenDialog(true);
    setDialogContent({
      title: 'Ewoks Graph',
      object: rfToEwoks(graphRF),
      openFrom: 'sidebar',
    });
  };

  return (
    <aside className="dndflow">
      {isExecuted ? (
        <div className={classes.executionSide}>
          <ExecutionDetails
            props={{
              ...props,
            }}
            setElement={setElement}
          />
        </div>
      ) : (
        <>
          <AddNodes />
          <EditElement
            props={{
              ...props,
            }}
            setElement={setElement}
          />
          <EditElementStyle
            props={{
              ...props,
            }}
            setElement={setElement}
          />
          <Button
            style={{ margin: '8px' }}
            variant="outlined"
            color="secondary"
            onClick={deleteElement}
            size="small"
          >
            Delete
          </Button>
          {!('source' in selectedElement) && (
            <IconMenu handleShowEwoksGraph={showEwoksGraph} />
          )}
          <DraggableDialog
            open={openDialog}
            content={dialogContent}
            setValue={defaultInputsChanged}
          />
        </>
      )}
      <Drawer />
    </aside>
  );
}
