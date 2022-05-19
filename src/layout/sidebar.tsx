import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import AddNodes from '../Components/AddNodes';
import EditElement from '../Components/EditElement';
import EditElementStyle from '../Components/EditElementStyle';
import DraggableDialog from '../Components/DraggableDialog';
import IconMenu from '../Components/IconMenu';
import SettingsInfoDrawer from '../Components/SettingsInfoDrawer';
import ExecutionDetails from '../Components/ExecutionDetails';
import DashboardStyle from './DashboardStyle';
import state from '../store/state';
import { getIcons } from '../utils/api';
import type {
  EwoksRFNode,
  EwoksRFLink,
  GraphDetails,
  GraphRF,
  IconsNames,
  Icons,
} from '../types';
import { rfToEwoks } from '../utils';
import ConfirmDialog from '../Components/ConfirmDialog';
import { deleteWorkflow } from '../utils/api';
import type { AxiosResponse } from 'axios';

const useStyles = DashboardStyle;

const getIconsL = async () => {
  const iconsData: IconsNames = await getIcons();
  console.log(typeof iconsData.identifiers, iconsData.identifiers);
  return iconsData.identifiers;
};

export default function Sidebar() {
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
  const [openAgreeDialog, setOpenAgreeDialog] = React.useState<boolean>(false);
  const setAllIcons = state((state) => state.setAllIcons);
  const allIcons = state((state) => state.allIcons);

  useEffect(() => {
    setElement(selectedElement);
    if (allIcons.length === 0) {
      getIconsL();
      // setAllIcons(getIconsL());
    }
  }, [selectedElement, allIcons.length, setAllIcons]);

  const deleteElement = async () => {
    let newGraph = {} as GraphRF;
    // console.log(element);
    const elN = element as EwoksRFNode; // TODO: is this the way to avoid typescript warning???
    const elL = element as EwoksRFLink;
    const elD = element as GraphDetails;
    if (elN.position) {
      const nodesLinks = graphRF.links.filter(
        (link) => !(link.source === elN.id || link.target === elN.id)
      );

      newGraph = {
        ...graphRF,
        nodes: graphRF.nodes.filter((nod) => nod.id !== element.id),
        links: nodesLinks,
      };
      setUndoRedo({
        action: 'Removed a Node',
        graph: newGraph,
      });
    } else if (elL.source) {
      newGraph = {
        ...graphRF,
        links: graphRF.links.filter((link) => link.id !== elL.id),
      };
      setUndoRedo({
        action: 'Removed a Link',
        graph: newGraph,
      });
    }

    if (elD.input_nodes && elD.id !== 'newGraph') {
      setOpenAgreeDialog(true);
    } else if (!elD.input_nodes) {
      if (workingGraph.graph.id === graphRF.graph.id) {
        setGraphRF(newGraph);
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

  const agreeCallback = async () => {
    setOpenAgreeDialog(false);
    try {
      await deleteWorkflow(element.id);
      setOpenSnackbar({
        open: true,
        text: `Workflow ${element.id} succesfully deleted!`,
        severity: 'success',
      });
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.message,
        severity: 'error',
      });
    }

    setGraphRF(initializedGraph);
    setSelectedElement({} as GraphDetails);
    setSubgraphsStack({ id: 'initialiase', label: '' });
    setRecentGraphs({} as GraphRF, true);
    // setDialogContent({
    //   title: 'Ewoks Graph',
    //   object: rfToEwoks(graphRF),
    //   openFrom: 'sidebar',
    // });
  };

  const disAgreeCallback = () => {
    setOpenAgreeDialog(false);
  };

  return (
    <aside className="dndflow">
      {isExecuted ? (
        <div className={classes.executionSide}>
          <ExecutionDetails
          // props={{
          //   selectedElement,
          // }}
          // setElement={setElement}
          />
        </div>
      ) : (
        <>
          <AddNodes title="Add Nodes" />
          <EditElement element={selectedElement} />
          <EditElementStyle />
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
          <DraggableDialog open={openDialog} content={dialogContent} />
          <ConfirmDialog
            title={`Delete "${element.label}" workflow?`}
            content={`You are about to delete "${element.label}" workflow.
              Please make sure that it is not used as a subgraph in other workflows!
              Do you agree to continue?`}
            open={openAgreeDialog}
            agreeCallback={agreeCallback}
            disagreeCallback={disAgreeCallback}
          />
        </>
      )}
      <SettingsInfoDrawer />
    </aside>
  );
}
