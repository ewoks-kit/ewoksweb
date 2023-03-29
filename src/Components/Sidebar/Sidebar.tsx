// TODO: remove the following after onlyEditRelease
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import {
  // Accordion,
  // AccordionDetails,
  // AccordionSummary,
  Button,
  // Typography,
} from '@material-ui/core';
import AddNodes from './AddNodes';
import ElementDetails from './details/ElementDetails';
import EditElementStyle from './edit/EditElementStyle';
import IconMenu from './IconMenu';
// import ExecutionDetails from '../Execution/ExecutionDetails';
// import DashboardStyle from '../Dashboard/DashboardStyle';
import useStore from 'store/useStore';
import type { EwoksRFNode } from 'types';
import { calcNewId } from 'utils/calcNewId';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { deleteWorkflow } from 'api/api';
// import { OpenInBrowser } from '@material-ui/icons';
// import SidebarTooltip from './SidebarTooltip';
import commonStrings from 'commonStrings.json';
import { assertNodeDataDefined, isLink } from '../../utils/typeGuards';
import { textForError } from '../../utils';
import { useNodesIds, useSelectedElement } from '../../store/graph-hooks';
import { useReactFlow } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import useSelectedElementStore from '../../store/useSelectedElementStore';

// const useStyles = DashboardStyle;

export default function Sidebar() {
  // const classes = useStyles();

  const nodesIds = useNodesIds();
  const { deleteElements, getNodes, setNodes, getEdges } = useReactFlow();

  // const selectedElement = useSelectedElement();
  const selectedElement = useSelectedElementStore(
    (state) => state.selectedElement
  );
  // const [openExecutionDetails, setOpenExecutionDetails] = useState<boolean>(
  //   false
  // );
  const graphInfo = useStore((state) => state.graphInfo);
  const workingGraph = useStore((state) => state.workingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const resetRecentGraphs = useStore((state) => state.resetRecentGraphs);
  const initializedGraph = useStore((state) => state.initializedGraph);
  const inExecutionMode = useStore((state) => state.inExecutionMode);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const initGraph = useStore((state) => state.initGraph);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const nodesData = useNodeDataStore((state) => state.nodesData);
  const setSelectedElement = useSelectedElementStore(
    (state) => state.setSelectedElement
  );

  const deleteElement = async () => {
    if (workingGraph.graph.id !== graphInfo.id) {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to delete any element in a sub-graph!',
        severity: 'success',
      });
      return;
    }

    if (selectedElement.type === 'node') {
      const node: Node | undefined = getNodes().find(
        (nod) => nod.id === selectedElement.id
      );
      // Need to set selectedElement to not be undefined or
      // when undefined it can show to graph.
      setSelectedElement({ type: 'graph', id: graphInfo.id });
      deleteElements({ nodes: [node] as Node[] });
      return;
    }

    if (selectedElement.type === 'edge') {
      const edge: Edge | undefined = getEdges().find(
        (edg) => edg.id === selectedElement.id
      );
      setSelectedElement({ type: 'graph', id: graphInfo.id });
      deleteElements({ edges: [edge] as Edge[] });
      return;
    }

    if (selectedElement.type === 'graph') {
      setOpenAgreeDialog(true);
      return;
    }

    setOpenSnackbar({
      open: true,
      text: 'Nothing to delete!',
      severity: 'error',
    });
  };

  const agreeCallback = async () => {
    setOpenAgreeDialog(false);
    if (selectedElement.id) {
      try {
        setSelectedElement({ type: 'graph', id: '' });
        await deleteWorkflow(selectedElement.id);
        setOpenSnackbar({
          open: true,
          text: `Workflow ${selectedElement.id} successfully deleted!`,
          severity: 'success',
        });
      } catch (error) {
        setOpenSnackbar({
          open: true,
          text: textForError(error, commonStrings.deletingError),
          severity: 'error',
        });
      }
    }

    initGraph(initializedGraph);
    setSubgraphsStack({ id: '', label: '', resetStack: true });
    resetRecentGraphs();
  };

  const disAgreeCallback = () => {
    setOpenAgreeDialog(false);
  };

  const cloneNode = () => {
    if (selectedElement.type === 'node') {
      const clonedNode = getNodes().find(
        (nod) => nod.id === selectedElement.id
      );

      if (!clonedNode) {
        setOpenSnackbar({
          open: true,
          text: 'Cannot locate the node to clone',
          severity: 'warning',
        });
        return;
      }
      const clonedNodeData = nodesData.get(selectedElement.id);
      assertNodeDataDefined(clonedNodeData, selectedElement.id);
      const newClone: EwoksRFNode = {
        ...clonedNode,
        id: calcNewId(clonedNode.id, nodesIds),
        selected: false,
        position: {
          x: (clonedNode.position?.x || 0) + 100,
          y: (clonedNode.position?.y || 0) + 100,
        },
      };

      const nodesRF = getNodes();

      setNodes([...nodesRF, newClone]);
      setNodeData(newClone.id, clonedNodeData);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Clone is for cloning nodes within the working workflow',
        severity: 'warning',
      });
    }
  };

  // const handleChangeExecutionDetails = (
  //   event: React.SyntheticEvent,
  //   expand: boolean
  // ) => {
  //   setOpenExecutionDetails(expand);
  // };

  return (
    <aside className="dndflow">
      {!inExecutionMode && (
        <>
          <AddNodes title="Add Nodes" />
          <ElementDetails />
          <EditElementStyle />
        </>
      )}
      {/* TODO: commented for onlyEditRelease */}
      {/* <Accordion
        expanded={openExecutionDetails}
        onChange={handleChangeExecutionDetails}
        className="Accordions-sidebar"
      >
        <AccordionSummary
          expandIcon={<OpenInBrowser />}
          aria-controls="panel1a-content"
          className="Accordions-sidebar"
        >
          <SidebarTooltip
            text={`Drag and drop Tasks from their categories
          to the canvas to create graphs.`}
          >
            <Typography>Execution History</Typography>
          </SidebarTooltip>
        </AccordionSummary>
        <AccordionDetails style={{ flexWrap: 'wrap', padding: '4px' }}>
          <div className={classes.executionSide}>
            <ExecutionDetails />
          </div>
        </AccordionDetails>
      </Accordion> */}
      {!inExecutionMode && (
        <>
          <Button
            style={{ margin: '8px' }}
            variant="outlined"
            color="secondary"
            onClick={() => {
              deleteElement();
            }}
            size="small"
          >
            Delete
          </Button>
          <Button
            style={{ margin: '8px' }}
            variant="outlined"
            color="primary"
            onClick={cloneNode}
            size="small"
            data-cy="cloneButton"
          >
            Clone
          </Button>
          {!isLink(selectedElement) && <IconMenu />}
          <ConfirmDialog
            title={`Delete "${
              (selectedElement.type === 'graph' && selectedElement.id) ||
              'not labelled'
            }" workflow?`}
            content={`You are about to delete "${
              (selectedElement.type === 'graph' && selectedElement.id) ||
              'a not labelled'
            }" workflow.
              Please make sure that it is not used as a subgraph in other workflows!
              Do you agree to continue?`}
            open={openAgreeDialog}
            agreeCallback={agreeCallback}
            disagreeCallback={disAgreeCallback}
          />
        </>
      )}
    </aside>
  );
}
