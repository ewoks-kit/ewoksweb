import { useKeyboardEvent } from '@react-hookz/web';
import type { DragEventHandler, MouseEvent } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
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

import { useTasks } from '../../api/tasks';
import { useWorkflow } from '../../api/workflows';
import { useCloneNode } from '../../general/hooks';
import useEdgeDataStore from '../../store/useEdgeDataStore';
import useNodeDataStore from '../../store/useNodeDataStore';
import useSnackbarStore from '../../store/useSnackbarStore';
import useStore from '../../store/useStore';
import type { RFNode, Task } from '../../types';
import { WorkflowSource } from '../../types';
import { getNodesData } from '../../utils';
import { calcNewId } from '../../utils/calcNewId';
import {
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_WIDTH,
} from '../../utils/defaultValues';
import isValidLink from '../../utils/IsValidLink';
import bendingText from '../CustomEdges/BendingTextEdge';
import getAround from '../CustomEdges/GetAroundEdge';
import multilineText from '../CustomEdges/MultilineTextEdge';
import DataNode from '../CustomNodes/DataNode';
import GraphInOutNode from '../CustomNodes/GraphInOutNode';
import GraphNode from '../CustomNodes/GraphNode';
import NoteNode from '../CustomNodes/NoteNode';
import AddSubworkflowDialog from '../TaskDrawer/AddSubworkflowDialog';
import styles from './Canvas.module.css';
import CanvasBackground from './CanvasBackground';
import FallbackMessage from './FallbackMessage';
import { addConnectionToGraph, retrieveTaskInfo } from './utils';

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
  notebook: DataNode,
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
    const newTabURL = `${window.location.origin}${window.location.pathname}?workflow=${nodeData.task_props.task_identifier}`;
    const newTab = window.open(newTabURL, '_blank');
    if (newTab) {
      newTab.focus();
    }
  }
};

interface Props {
  workflowId: string | undefined;
}

function Canvas(props: Props) {
  const { workflowId } = props;

  const workflow = useWorkflow(workflowId);

  const storeRF = useStoreApi();
  const rfInstance = useReactFlow();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const [addSubworkflowEvent, setSubworkflowEvent] = useState<{
    position: XYPosition;
  }>();

  const setRootWorkflow = useStore((state) => state.setRootWorkflow);
  const resetRootWorkflow = useStore((state) => state.resetRootWorkflow);
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );

  const tasks = useTasks();
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);
  const showInfoMsg = useSnackbarStore((state) => state.showInfoMsg);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const setEdgeData = useEdgeDataStore((state) => state.setEdgeData);
  const { setEdges, getNodes, getEdges, addNodes } = rfInstance;
  const cloneNode = useCloneNode();

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
        category: task.category,
        optional_input_names: task.optional_input_names,
        output_names: task.output_names,
        required_input_names: task.required_input_names,
      },
      ewoks_props: {},
      ui_props: {
        ...(icon && { icon }),
      },
    });
    addNodes(newNode);
  };

  function isValidConnection(connection: Connection, oldEdge?: Edge): boolean {
    const { isValid, reason } = isValidLink(
      connection,
      getNodes(),
      getEdges(),
      getNodesData(),
      oldEdge,
    );
    if (!isValid) {
      showWarningMsg(reason);
      return false;
    }
    return true;
  }

  const onEdgeUpdate = (oldEdge: Edge, connection: Connection) => {
    if (!isValidConnection(connection, oldEdge)) {
      return;
    }

    const newEdges = addEdge(
      { ...oldEdge, ...connection },
      getEdges().filter((edge) => edge.id !== oldEdge.id),
    );

    setEdges(newEdges);
  };

  const onConnect = (connection: Connection) => {
    if (!isValidConnection(connection)) {
      return;
    }
    const newLink = addConnectionToGraph(connection, getNodesData());

    if (newLink) {
      setEdgeData(newLink.id, newLink.data);
      setEdges([...getEdges(), newLink]);
    }
  };

  const onPaneContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    showInfoMsg('Open a graph and click on nodes and links on this Canvas!');
  };

  useKeyboardEvent(
    (e) => (e.ctrlKey || e.metaKey) && e.key === 'd',
    (e) => {
      e.preventDefault();
      const selectedNode = getNodes().find((nod) => nod.selected);
      if (!selectedNode) {
        showWarningMsg(
          'Ctrl+D duplicates a node in the existing workflow. First select a node to duplicate!',
        );
        return;
      }
      cloneNode(selectedNode.id);
    },
    [],
  );

  return (
    <>
      <AddSubworkflowDialog
        open={!!addSubworkflowEvent}
        position={addSubworkflowEvent?.position}
        onClose={() => setSubworkflowEvent(undefined)}
      />
      <div className={styles.root}>
        <div className={styles.wrapper} ref={reactFlowWrapper}>
          {!rootWorkflowId && <FallbackMessage />}
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
            onInit={() => {
              if (workflow) {
                setRootWorkflow(
                  workflow,
                  rfInstance,
                  tasks,
                  WorkflowSource.Server,
                );
              } else {
                resetRootWorkflow(rfInstance, tasks);
              }
            }}
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
