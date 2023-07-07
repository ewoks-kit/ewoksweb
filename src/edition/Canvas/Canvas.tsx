import type { DragEventHandler, MouseEvent } from 'react';
import { useEffect, useRef } from 'react';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow';
import { updateEdge } from 'reactflow';
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
import type { EwoksRFNode, EwoksRFLink, EwoksRFNodeData } from 'types';
import useStore from 'store/useStore';
import { calcNewId } from 'utils/calcNewId';
import isValidLink from 'utils/IsValidLink';
import CanvasBackground from './CanvasBackground';
import { addConnectionToGraph, retrieveTaskInfo, trimLabel } from './utils';
import { useStoreApi } from 'reactflow';
import { useGraphId } from '../../store/graph-hooks';
import useNodeDataStore from '../../store/useNodeDataStore';
import useEdgeDataStore from '../../store/useEdgeDataStore';
import { getEdgesData, getNodeData, getNodesData } from '../../utils';
import {
  assertNodeDataDefined,
  assertNodeDefined,
} from '../../utils/typeGuards';
import FallbackMessage from './FallbackMessage';
import GraphInOutNode from '../CustomNodes/GraphInOutNode';

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

  const graphInfo = useStore((state) => state.graphInfo);
  const setGraphInfo = useStore((state) => state.setGraphInfo);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const addRecentGraph = useStore((state) => state.addRecentGraph);

  const tasks = useStore((state) => state.tasks);
  const recentGraphs = useStore((state) => state.recentGraphs);
  const workingGraphId = useStore((state) => state.workingGraph.graph.id);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const setNodesData = useNodeDataStore((state) => state.setNodesData);
  const setEdgeData = useEdgeDataStore((state) => state.setEdgeData);
  const setEdgesData = useEdgeDataStore((state) => state.setEdgesData);
  const graphId = useGraphId();
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
  }, [workingGraphId, fitView]);

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

    if (workingGraphId !== graphId) {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to add a new node to any sub-graph!',
        severity: 'success',
      });
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

    const task = tasks.find(
      (tas) => tas.task_identifier === task_identifier
    ) || {
      optional_input_names: [],
      output_names: [],
      required_input_names: [],
    };

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
        task_generator: '',
        default_inputs: [],
        inputs_complete: false,
        default_error_node: false,
        default_error_attributes: {
          map_all_data: true,
          data_mapping: [],
        },
      },
      ui_props: {
        icon,
        moreHandles: false,
        nodeWidth: 100,
        withImage: true,
        withLabel: true,
      },
    });
    addNodes(newNode);
  };

  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    // DOC: if the new link is:
    // 1. attached to a node-handle where there is already a link or
    // 2. is attached to an input-output already connected to a node then
    // edgeUpdate should not happen and a message informs it is not ewoks-compatible
    const nodesRF = getNodes();
    const edgesRF = getEdges();
    const { isValid, reason } = isValidLink(
      newConnection,
      {
        nodes: nodesRF,
        links: edgesRF as EwoksRFLink[],
        graph: graphInfo,
      },
      getNodesData(),
      oldEdge
    );
    if (!isValid) {
      setOpenSnackbar({
        open: true,
        text: reason,
        severity: 'warning',
      });
    }
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  };

  const onConnect = (params: Connection) => {
    if (workingGraphId !== graphId) {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to create new links to any sub-graph!',
        severity: 'success',
      });
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
    setOpenSnackbar({
      open: true,
      text: 'Open a graph and click on nodes and links on this Canvas!',
      severity: 'success',
    });
  };

  const onNodeDoubleClick = (event: MouseEvent, node: Node) => {
    event.preventDefault();

    const nodeData = getNodesData().get(node.id);
    if (!nodeData) {
      return;
    }
    if (nodeData.task_props.task_type === 'graph') {
      setOpenSnackbar({
        open: true,
        text: 'Any link changes in any subgraph will not be saved!',
        severity: 'warning',
      });
      addRecentGraph({
        graph: graphInfo,
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

      const subgraph = recentGraphs.find(
        (gr) => gr.graph.id === nodeData.task_props.task_identifier
      );

      if (subgraph?.graph.id) {
        setNodes(subgraph.nodes);

        setNodesData(subgraph.nodes);
        setEdgesData(subgraph.links);

        setEdges(subgraph.links);

        setGraphInfo(subgraph.graph);
        setTimeout(() => {
          fitView({ duration: 500 });
        }, 300);
        setSubgraphsStack({
          id: subgraph.graph.id,
          label: subgraph.graph.label,
        });
      } else {
        setOpenSnackbar({
          open: true,
          text: 'Seems the specific subgraph cannot be located!',
          severity: 'error',
        });
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
        setOpenSnackbar({
          open: true,
          text: 'First select a node to clone!',
          severity: 'error',
        });
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
  );
}

export default Canvas;
