import { useState } from 'react';
import { Button } from '@material-ui/core';
import EditElementStyle from './edit/EditElementStyle';
import IconMenu from './IconMenu';
import useStore from 'store/useStore';
import type { EwoksRFNode } from 'types';
import { calcNewId } from 'utils/calcNewId';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { deleteWorkflow } from 'api/api';
import commonStrings from 'commonStrings.json';
import {
  assertNodeDataDefined,
  isNode,
  isNodeRF,
} from '../../utils/typeGuards';
import { getNodesData, textForError } from '../../utils';
import { useNodesIds } from '../../store/graph-hooks';
import { useReactFlow } from 'reactflow';
import type { Node, Edge, ReactFlowState } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import useSelectedElementStore from '../../store/useSelectedElementStore';
import ElementDetails from './details/ElementDetails';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { useStore as useRFStore } from 'reactflow';

const nodeEdgeSelectedSelector = (state: ReactFlowState) => {
  console.log(state);

  const nodeSelected =
    state.nodeInternals &&
    [...state.nodeInternals.values()].find((node) => node.selected);
  if (nodeSelected) {
    console.log(nodeSelected);

    return nodeSelected;
  }
  const edgeSelected =
    state.edges && [...state.edges.values()].find((edge) => edge.selected);
  if (edgeSelected) {
    console.log(edgeSelected);
    return edgeSelected;
  }
  return undefined;
};

export default function EditSidebar() {
  const nodesIds = useNodesIds();
  const rfInstance = useReactFlow();
  const selected = useRFStore(nodeEdgeSelectedSelector);

  const selectedElement = useSelectedElementStore(
    (state) => state.selectedElement
  );
  const graphInfo = useStore((state) => state.graphInfo);
  const workingGraph = useStore((state) => state.workingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const resetRecentGraphs = useStore((state) => state.resetRecentGraphs);
  const initializedGraph = useStore((state) => state.initializedGraph);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const initGraph = useStore((state) => state.initGraph);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
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
      const node: Node | undefined = rfInstance
        .getNodes()
        .find((nod) => nod.id === selectedElement.id);
      // Need to set selectedElement to not be undefined or
      // when undefined it can show to graph.
      setSelectedElement({ type: 'graph', id: graphInfo.id });
      rfInstance.deleteElements({ nodes: [node] as Node[] });
      return;
    }

    if (selectedElement.type === 'edge') {
      const edge: Edge | undefined = rfInstance
        .getEdges()
        .find((edg) => edg.id === selectedElement.id);
      setSelectedElement({ type: 'graph', id: graphInfo.id });
      rfInstance.deleteElements({ edges: [edge] as Edge[] });
      return;
    }

    setOpenAgreeDialog(true);
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

    initGraph(initializedGraph, undefined, rfInstance);
    setSubgraphsStack({ id: '', label: '', resetStack: true });
    resetRecentGraphs();
  };

  const disAgreeCallback = () => {
    setOpenAgreeDialog(false);
  };

  const cloneNode = () => {
    if (selectedElement.type === 'node') {
      const nodes = rfInstance.getNodes();
      const clonedNode = nodes.find((nod) => nod.id === selectedElement.id);

      if (!clonedNode) {
        setOpenSnackbar({
          open: true,
          text: 'Cannot locate the node to clone',
          severity: 'warning',
        });
        return;
      }
      const clonedNodeData = getNodesData().get(selectedElement.id);
      assertNodeDataDefined(clonedNodeData, selectedElement.id);
      const newClone: EwoksRFNode = {
        ...clonedNode,
        id: calcNewId(clonedNode.id, nodesIds),
        selected: false,
        position: {
          x: (clonedNode.position.x || 0) + 100,
          y: (clonedNode.position.y || 0) + 100,
        },
      };

      rfInstance.setNodes([...nodes, newClone]);
      setNodeData(newClone.id, clonedNodeData);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Clone is for cloning nodes within the working workflow',
        severity: 'warning',
      });
    }
  };

  return (
    <aside className="dndflow">
      {/* Inline style till sidebar is refactored */}
      <span style={{ display: 'block' }}>
        <span
          style={{
            fontSize: 30,
            color: 'blue',
          }}
        >
          {isNodeRF(selected) // selectedElement.type === 'node'
            ? 'Node'
            : selectedElement.type === 'edge'
            ? 'Edge'
            : 'Workflow'}
        </span>
        <span style={{ float: 'right' }}>
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
            <DeleteIcon fontSize="small" />
          </Button>
          {selectedElement.type === 'node' && (
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
          )}
          {selectedElement.type !== 'edge' && <IconMenu />}
        </span>
      </span>
      <ElementDetails />
      <EditElementStyle />
      <ConfirmDialog
        // TODO: Here maybe it is better to see the label and id.
        title={`Delete workflow with id: "${
          selectedElement.type === 'graph' && selectedElement.id
        }"?`}
        content={`You are about to delete the workflow wit id: "${
          selectedElement.type === 'graph' && selectedElement.id
        }".
              Please make sure that it is not used as a subgraph in other workflows!
              Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={agreeCallback}
        disagreeCallback={disAgreeCallback}
      />
    </aside>
  );
}
