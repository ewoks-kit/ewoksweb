import type { DragEventHandler, MouseEvent } from 'react';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  XYPosition,
} from 'reactflow';
import { addEdge } from 'reactflow';
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  useReactFlow,
} from 'reactflow';
import { useStoreApi } from 'reactflow';
import type { RFNode, Task } from 'types';

import { useTasks } from '../../api/tasks';
import useEdgeDataStore from '../../store/useEdgeDataStore';
import useNodeDataStore from '../../store/useNodeDataStore';
import useSnackbarStore from '../../store/useSnackbarStore';
import useStore from '../../store/useStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import { getNodeData, getNodesData } from '../../utils';
import { calcNewId } from '../../utils/calcNewId';
import {
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_WIDTH,
} from '../../utils/defaultValues';
import isValidLink from '../../utils/IsValidLink';
import {
  assertNodeDataDefined,
  assertNodeDefined,
} from '../../utils/typeGuards';
import bendingText from '../CustomEdges/BendingTextEdge';
import getAround from '../CustomEdges/GetAroundEdge';
import multilineText from '../CustomEdges/MultilineTextEdge';
import DataNode from '../CustomNodes/DataNode';
import GraphInOutNode from '../CustomNodes/GraphInOutNode';
import GraphNode from '../CustomNodes/GraphNodeContent';
import NoteNode from '../CustomNodes/NoteNode';
import AddSubworkflowDialog from '../TaskDrawer/AddSubworkflowDialog';
import styles from './Canvas.module.css';
import CanvasBackground from './CanvasBackground';
import FallbackMessage from './FallbackMessage';
import { addConnectionToGraph, retrieveTaskInfo, trimLabel } from './utils';

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
  generated: DataNode,
  graphInput: GraphInOutNode,
  graphOutput: GraphInOutNode,
  class: DataNode,
};

const onNodeDoubleClick = (event: MouseEvent, node: Node) => {
  event.preventDefault();

  const nodeData = getNodesData().get(node.id);
  if (!nodeData) {
    return;
  }
  if (nodeData.task_props.task_type === 'graph') {
    const newTabURL = `${window.location.origin}/edit?workflow=${node.id}`;
    const newTab = window.open(newTabURL, '_blank');
    if (newTab) {
      newTab.focus();
    }
  }
};

function Canvas() {
  const storeRF = useStoreApi();
  const rfInstance = useReactFlow();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [addSubworkflowEvent, setSubworkflowEvent] = useState<{
    position: XYPosition;
  }>();

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );

  const tasks = useTasks();
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);
  const showInfoMsg = useSnackbarStore((state) => state.showInfoMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const setEdgeData = useEdgeDataStore((state) => state.setEdgeData);
  const { fitView, setNodes, setEdges, getNodes, getEdges, addNodes, getNode } =
    rfInstance;

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
    const reactFlowBounds =
      reactFlowWrapper.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
      };

    const taskInfo = retrieveTaskInfo(event.dataTransfer);
    if (!taskInfo) {
      return;
    }
    const { task_type, icon, task_identifier, category } = taskInfo;

    const { left, top } = reactFlowBounds;
    const { clientX, clientY } = event;
    const position = rfInstance.project({
      x: clientX - left - (DEFAULT_NODE_WIDTH * rfInstance.getZoom()) / 2,
      y: clientY - top - (DEFAULT_NODE_HEIGHT * rfInstance.getZoom()) / 2,
    });

    if (task_type === 'subworkflow') {
      setSubworkflowEvent({
        position,
      });
      return;
    }

    let task: Task | undefined;

    if (category === 'General') {
      task = {
        ...taskInfo,
        category: 'General',
      };
    } else {
      task = tasks.find((tas) => tas.task_identifier === task_identifier);

      if (!task) {
        return;
      }
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

    const newNode: RFNode = {
      id: newId,
      type: task_type,
      position,
      data: {},
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
      oldEdge,
    );
    if (!isValid) {
      showWarningMsg(reason);
    }

    const newEdges = addEdge(
      { ...oldEdge, ...newConnection },
      getEdges().filter((edge) => edge.id !== oldEdge.id),
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

      const newClone: RFNode = {
        ...node,
        id: calcNewId(selectedNode.id, nodesIds),
        selected: false,
        position: {
          x: (node.position.x || 0) + 100,
          y: (node.position.y || 0) + 100,
        },
        data: {},
      };

      setNodes([...getNodes(), newClone]);
      setNodeData(newClone.id, nodeData);
    }
  };

  const isValidConnection = (connection: Connection) => {
    const { isValid, reason } = isValidLink(
      connection,
      getNodes(),
      getEdges(),
      getNodesData(),
    );
    if (!isValid) {
      showWarningMsg(reason);
    }
    return isValid;
  };

  return (
    <>
      <AddSubworkflowDialog
        open={!!addSubworkflowEvent}
        position={addSubworkflowEvent?.position}
        onClose={() => setSubworkflowEvent(undefined)}
      />
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions*/}
      <div className={styles.root} onKeyDown={handleKeyDown}>
        <FallbackMessage />
        <div className={styles.wrapper} ref={reactFlowWrapper}>
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
            isValidConnection={isValidConnection}
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
