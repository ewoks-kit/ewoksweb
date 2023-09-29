import type { DragEventHandler, MouseEvent } from 'react';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import type {
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  XYPosition,
} from 'reactflow';
import { addEdge } from 'reactflow';
import ReactFlow, {
  Controls,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import bendingText from '../CustomEdges/BendingTextEdge';
import multilineText from '../CustomEdges/MultilineTextEdge';
import getAround from '../CustomEdges/GetAroundEdge';
import GraphNode from '../CustomNodes/GraphNode';
import NoteNode from '../CustomNodes/NoteNode';
import DataNode from '../CustomNodes/DataNode';
import type { EwoksRFNode, EwoksRFNodeData, Task } from 'types';
import useStore from 'store/useStore';
import useSnackbarStore from 'store/useSnackbarStore';
import { calcNewId } from 'utils/calcNewId';
import isValidLink from 'utils/IsValidLink';
import CanvasBackground from './CanvasBackground';
import { addConnectionToGraph, retrieveTaskInfo, trimLabel } from './utils';
import { useStoreApi } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import useEdgeDataStore from '../../store/useEdgeDataStore';
import { getEdgesData, getNodeData, getNodesData } from '../../utils';
import {
  assertNodeDataDefined,
  assertNodeDefined,
} from '../../utils/typeGuards';
import FallbackMessage from './FallbackMessage';
import GraphInOutNode from '../CustomNodes/GraphInOutNode';
import AddSubworkflowDialog from '../TaskDrawer/AddSubworkflowDialog';
import { useTasks } from '../../api/tasks';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
  })
);

const edgeTypes = {
  bendingText,
  multilineText,
  getAround,
};

const nodeTypes = {
  note: NoteNode,
  graph: GraphNode,
  method: DataNode,
  ppfmethod: DataNode,
  graphInput: GraphInOutNode,
  graphOutput: GraphInOutNode,
  class: DataNode,
};

function Canvas() {
  const classes = useStyles();

  const storeRF = useStoreApi();
  const rfInstance = useReactFlow();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [addSubworkflowEvent, setSubworkflowEvent] = useState<{
    position: XYPosition;
  }>();

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo
  );
  const setDisplayedWorkflowInfo = useStore(
    (state) => state.setDisplayedWorkflowInfo
  );
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const addLoadedGraph = useStore((state) => state.addLoadedGraph);

  const tasks = useTasks();
  const loadedGraphs = useStore((state) => state.loadedGraphs);
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);
  const showInfoMsg = useSnackbarStore((state) => state.showInfoMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const setDataFromNodes = useNodeDataStore((state) => state.setDataFromNodes);
  const setEdgeData = useEdgeDataStore((state) => state.setEdgeData);
  const setDataFromEdges = useEdgeDataStore((state) => state.setDataFromEdges);
  const {
    fitView,
    setNodes,
    setEdges,
    getNodes,
    getEdges,
    addNodes,
    getNode,
  } = rfInstance;

  useEffect(() => {
    setTimeout(() => {
      fitView({ duration: 500 });
    }, 300);
  }, [rootWorkflowId, fitView]);

  function onNodesChange(changes: NodeChange[]) {
    const newNodes = applyNodeChanges(changes, getNodes());
    storeRF.getState().setNodes(newNodes);
  }

  function onEdgesChange(changes: EdgeChange[]) {
    const newEdges = applyEdgeChanges(changes, getEdges());
    storeRF.getState().setEdges(newEdges);
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const onDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    if (rootWorkflowId !== displayedWorkflowInfo.id) {
      showWarningMsg('Not allowed to add a new node to any sub-graph!');
      return;
    }

    const stateRF = storeRF.getState();
    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect() || {
      left: 0,
      top: 0,
    };

    const taskInfo = retrieveTaskInfo(event.dataTransfer);
    if (!taskInfo) {
      return;
    }
    const { task_type, icon, task_identifier } = taskInfo;

    const position = rfInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    if (task_type === 'subworkflow') {
      setSubworkflowEvent({
        position,
      });
      return;
    }

    let task: Task | undefined;

    if (task_type !== 'note') {
      task = tasks.find((tas) => tas.task_identifier === task_identifier);

      if (!task) {
        return;
      }
    } else {
      task = {
        ...taskInfo,
        category: 'General',
        optional_input_names: undefined,
        output_names: undefined,
        required_input_names: undefined,
      };
    }

    const nodesIds = [...stateRF.nodeInternals.keys()];
    const newId =
      task_type === 'graphInput'
        ? calcNewId('In', nodesIds)
        : task_type === 'graphOutput'
        ? calcNewId('Out', nodesIds)
        : task_type === 'note'
        ? calcNewId('Note', nodesIds)
        : calcNewId(task_identifier || 'Node', nodesIds);

    const newNode: EwoksRFNode = {
      id: newId,
      type: task_type,
      position,
      data: {} as EwoksRFNodeData,
    };

    setNodeData(newId, {
      task_props: {
        task_type,
        task_identifier,
        task_category: task.category,
        optional_input_names: task.optional_input_names,
        output_names: task.output_names,
        required_input_names: task.required_input_names,
      },
      ewoks_props: {
        label: trimLabel(task_identifier),
      },
      ui_props: {
        ...(icon && { icon }),
      },
    });
    addNodes(newNode);
  };

  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    // DOC: if the new link is:
    // 1. attached to a node-handle where there is already a link or
    // 2. is attached to an input-output already connected to a node then
    // edgeUpdate should not happen and a message informs it is not ewoks-compatible
    const { isValid, reason } = isValidLink(
      newConnection,
      getNodes(),
      getEdges(),
      getNodesData(),
      oldEdge
    );
    if (!isValid) {
      showWarningMsg(reason);
    }

    const newEdges = addEdge(
      { ...oldEdge, ...newConnection },
      getEdges().filter((edge) => edge.id !== oldEdge.id)
    );

    setEdges(newEdges);
  };

  const onConnect = (params: Connection) => {
    if (rootWorkflowId !== displayedWorkflowInfo.id) {
      showWarningMsg('Not allowed to create new links to any sub-graph!');
      return;
    }
    const newLink = addConnectionToGraph(params, getNodesData());

    if (newLink) {
      setEdgeData(newLink.id, newLink.data);
      setEdges([...getEdges(), newLink]);
    }
  };

  const onPaneContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    showInfoMsg('Open a graph and click on nodes and links on this Canvas!');
  };

  const onNodeDoubleClick = (event: MouseEvent, node: Node) => {
    event.preventDefault();

    const nodeData = getNodesData().get(node.id);
    if (!nodeData) {
      return;
    }
    if (nodeData.task_props.task_type === 'graph') {
      showWarningMsg('Any link changes in any subgraph will not be saved!');
      addLoadedGraph({
        graph: displayedWorkflowInfo,
        nodes: getNodes().map((nod) => {
          return {
            ...nod,
            data: { ...nod.data, ...getNodesData().get(nod.id) },
          };
        }),
        links: getEdges().map((edge) => {
          return {
            ...edge,
            data: { ...edge.data, ...getEdgesData().get(edge.id) },
          };
        }),
      });

      const subgraph = loadedGraphs.get(nodeData.task_props.task_identifier);

      if (subgraph?.graph.id) {
        setNodes(subgraph.nodes);

        setDataFromNodes(subgraph.nodes);
        setDataFromEdges(subgraph.links);

        setEdges(subgraph.links);

        setDisplayedWorkflowInfo(subgraph.graph);
        setTimeout(() => {
          fitView({ duration: 500 });
        }, 300);
        setSubgraphsStack({
          id: subgraph.graph.id,
          label: subgraph.graph.label,
        });
      } else {
        showErrorMsg(
          `The subgraph ${nodeData.task_props.task_identifier} cannot be located!`
        );
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLImageElement>) => {
    const charCode = String.fromCodePoint(event.which).toLowerCase();

    const keys = event.ctrlKey || event.metaKey;
    if (keys && charCode === 'v') {
      event.preventDefault();
      event.stopPropagation();
      const selectedNode = getNodes().find((nod) => nod.selected);
      if (!selectedNode) {
        showErrorMsg('First select a node to clone!');
        return;
      }

      const nodesIds = [...storeRF.getState().nodeInternals.keys()];

      const node = getNode(selectedNode.id);
      assertNodeDefined(node, selectedNode.id);

      const nodeData = getNodeData(selectedNode.id);
      assertNodeDataDefined(nodeData, selectedNode.id);

      const newClone: EwoksRFNode = {
        ...node,
        data: nodeData,
        id: calcNewId(selectedNode.id, nodesIds),
        selected: false,
        position: {
          x: (node.position.x || 0) + 100,
          y: (node.position.y || 0) + 100,
        },
      };

      setNodes([...getNodes(), newClone]);
      setNodeData(newClone.id, newClone.data);
    }
  };

  return (
    <>
      <AddSubworkflowDialog
        open={!!addSubworkflowEvent}
        position={addSubworkflowEvent?.position}
        tasks={tasks}
        onClose={() => setSubworkflowEvent(undefined)}
      />
      <div
        className={classes.root}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <FallbackMessage />
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            fitView
            connectOnClick
            nodesDraggable
            attributionPosition="bottom-right"
            minZoom={0.2}
            snapToGrid
            onDrop={onDrop}
            onConnect={onConnect}
            onEdgeUpdate={onEdgeUpdate}
            onDragOver={onDragOver}
            onPaneContextMenu={onPaneContextMenu}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            deleteKeyCode="Delete"
          >
            <CanvasBackground />
            <Controls position="bottom-right" />
          </ReactFlow>
        </div>
      </div>
    </>
  );
}

export default Canvas;
