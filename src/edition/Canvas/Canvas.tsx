import { useKeyboardEvent } from '@react-hookz/web';
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  XYPosition,
} from '@xyflow/react';
import { addEdge } from '@xyflow/react';
import {
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  ReactFlow,
  useReactFlow,
} from '@xyflow/react';
import { useStoreApi } from '@xyflow/react';
import type { DragEventHandler, MouseEvent } from 'react';
import { useState } from 'react';
import { useRef } from 'react';

import { useTasks } from '../../api/tasks';
import { useWorkflow } from '../../api/workflows';
import useEdgeDataStore from '../../store/useEdgeDataStore';
import useNodeDataStore from '../../store/useNodeDataStore';
import useSnackbarStore from '../../store/useSnackbarStore';
import useWorkflowHistory from '../../store/useWorkflowHistory';
import useWorkflowStore from '../../store/useWorkflowStore';
import type { RFNode, Task } from '../../types';
import { WorkflowSource } from '../../types';
import { getNodesData } from '../../utils';
import isValidLink from '../../utils/IsValidLink';
import BendingTextEdge from '../edges/BendingTextEdge';
import MultilineTextEdge from '../edges/MultilineTextEdge';
import { useCloneNode } from '../hooks';
import GraphNode from '../nodes/GraphNode';
import InputNode from '../nodes/InputNode';
import NoteNode from '../nodes/NoteNode';
import OutputNode from '../nodes/OutputNode';
import RegularNode from '../nodes/RegularNode';
import AddSubworkflowDialog from '../TaskDrawer/AddSubworkflowDialog';
import { generateNewNodeId } from '../utils';
import styles from './Canvas.module.css';
import CanvasBackground from './CanvasBackground';
import FallbackMessage from './FallbackMessage';
import { addConnectionToGraph, retrieveTaskInfo } from './utils';

const edgeTypes = {
  bendingText: BendingTextEdge,
  multilineText: MultilineTextEdge,
};

const nodeTypes = {
  note: NoteNode,
  graph: GraphNode,
  method: RegularNode,
  ppfmethod: RegularNode,
  generated: RegularNode,
  notebook: RegularNode,
  graphInput: InputNode,
  graphOutput: OutputNode,
  class: RegularNode,
};

function onNodeDoubleClick(event: MouseEvent, node: Node) {
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
}

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

  const loadWorkflow = useWorkflowStore((state) => state.loadWorkflow);
  const resetWorkflow = useWorkflowStore((state) => state.resetWorkflow);

  const tasks = useTasks();
  const resetWorkflowHistory = useWorkflowHistory(
    (state) => state.resetWorkflowHistory,
  );
  const loadedWorkflowId = useWorkflowStore((state) => state.workflowInfo.id);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);
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

    const stateRF = storeRF.getState();
    const taskInfo = retrieveTaskInfo(event.dataTransfer);
    if (!taskInfo) {
      return;
    }
    const { task_type, icon, task_identifier, category } = taskInfo;

    const { clientX, clientY } = event;
    const position = rfInstance.screenToFlowPosition({
      x: clientX,
      y: clientY,
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

    const nodesIds = [...stateRF.nodeLookup.keys()];
    const newId = generateNewNodeId(task, nodesIds);

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

  const onReconnect = (oldEdge: Edge, connection: Connection) => {
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
          {!loadedWorkflowId && <FallbackMessage />}
          <ReactFlow
            fitView
            connectOnClick
            nodesDraggable
            attributionPosition="bottom-right"
            minZoom={0.2}
            snapToGrid
            onDrop={onDrop}
            onConnect={onConnect}
            onReconnect={onReconnect}
            onDragOver={onDragOver}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            deleteKeyCode="Delete"
            onInit={() => {
              if (workflow) {
                loadWorkflow(
                  workflow,
                  rfInstance,
                  tasks,
                  WorkflowSource.Server,
                );
              } else {
                resetWorkflow(rfInstance, tasks);
              }
              resetWorkflowHistory();
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
