import type { DragEventHandler, MouseEvent } from 'react';
import { useEffect, useState, useRef } from 'react';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow';
import { useOnSelectionChange } from 'reactflow';
import ReactFlow, {
  Controls,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import bendingText from 'CustomEdges/BendingTextEdge';
import multilineText from 'CustomEdges/MultilineTextEdge';
import getAround from 'CustomEdges/GetAroundEdge';

import FunctionNode from 'CustomNodes/FunctionNode';
import NoteNode from 'CustomNodes/NoteNode';
import ExecutionStepsNode from 'CustomNodes/ExecutionStepsNode';
import DataNode from 'CustomNodes/DataNode';
import type { EwoksRFNode, EwoksRFLink, EwoksRFNodeData } from 'types';
import useStore from 'store/useStore';
import { calcNewId } from 'utils/calcNewId';
import isValidLink from 'utils/IsValidLink';
import CanvasBackground from './CanvasBackground';
import CanvasMiniMap from './CanvasMiniMap';
import { addConnectionToGraph, trimLabel } from './utils';
import { useStoreApi } from 'reactflow';
import { useGraphId, useSelectedElement } from '../../store/graph-hooks';
import { isNode } from '../../utils/typeGuards';
import useSelectedElementStore from '../../store/useSelectedElementStore';
import useNodeDataStore from '../../store/useNodeDataStore';

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
  executionSteps: ExecutionStepsNode,
  note: NoteNode,
  graph: FunctionNode,
  method: DataNode,
  ppfmethod: DataNode,
  graphInput: DataNode,
  graphOutput: DataNode,
  class: DataNode,
};

function Canvas() {
  const classes = useStyles();

  const storeRF = useStoreApi();
  const rfInstance = useReactFlow();
  const [prevGraphId, setPrevGraphId] = useState('');

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const graphInfo = useStore((state) => state.graphInfo);
  const setGraphInfo = useStore((state) => state.setGraphInfo);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const subgraphsStack = useStore((state) => state.subgraphsStack);
  const addRecentGraph = useStore((state) => state.addRecentGraph);
  const setSelectedElement = useSelectedElementStore(
    (state) => state.setSelectedElement
  );
  const setSelectedTask = useStore((state) => state.setSelectedTask);
  const tasks = useStore((state) => state.tasks);
  const recentGraphs = useStore((state) => state.recentGraphs);
  const workingGraph = useStore((state) => state.workingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  // const setUndoRedo = useStore((state) => state.setUndoRedo);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const setNodesData = useNodeDataStore((state) => state.setNodesData);
  const nodesData = useNodeDataStore((state) => state.nodesData);

  const graphId = useGraphId();

  const selectedElement = useSelectedElement();

  const {
    fitView,
    getZoom,
    zoomTo,
    setNodes,
    setEdges,
    getNodes,
    getEdges,
    addNodes,
    getNode,
  } = rfInstance;

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      if (nodes.length > 0) {
        setSelectedElement({ type: 'node', id: nodes[0].id });
        return;
      }
      if (edges.length > 0) {
        setSelectedElement({ type: 'edge', id: edges[0].id });
        return;
      }
      setSelectedElement({ type: 'graph', id: graphInfo.id });
    },
  });

  useEffect(() => {
    setNodes(workingGraph.nodes);
    setEdges(workingGraph.links);
  }, [workingGraph, setEdges, setNodes]);

  useEffect(() => {
    if (subgraphsStack[subgraphsStack.length - 1]?.id) {
      setPrevGraphId(subgraphsStack[subgraphsStack.length - 1].id);
    }
  }, [subgraphsStack]);

  // TODO: Merge with the above since it is based on the above value is not working
  useEffect(() => {
    if (prevGraphId !== graphId) {
      const nodesLength = getNodes().length;

      setTimeout(() => {
        if (nodesLength === 0) {
          return;
        }
        // DOC: Define a zoom level for small graphs to not show very-big nodes
        if (nodesLength < 6) {
          zoomTo(0.6);
        } else {
          fitView();
        }
        // DOC: the value of the delay is important to fitview even the execution
        // that takes up to 4secs. Possibly rerender after the call to get the workflow??
      }, 1000);
      // DOC: if I clear the timeout for memory leaks the setTImeout never runs fitview???
      // return () => clearTimeout(timer);
    }
  }, [getNodes, graphId, fitView, getZoom, zoomTo, prevGraphId]);

  function onNodesChange(changes: NodeChange[]) {
    const newNodes = applyNodeChanges(changes, getNodes());
    if (workingGraph.graph.id !== graphId) {
      setOpenSnackbar({
        open: true,
        text: 'Any node changes in any subgraph will not be saved!',
        severity: 'warning',
      });
    }
    storeRF.getState().setNodes(newNodes);
  }

  function onEdgesChange(changes: EdgeChange[]) {
    const newEdges = applyEdgeChanges(changes, getEdges());
    if (workingGraph.graph.id !== graphId) {
      setOpenSnackbar({
        open: true,
        text: 'Any link changes in any subgraph will not be saved!',
        severity: 'warning',
      });
    }
    storeRF.getState().setEdges(newEdges);
  }

  const onPaneClick = () => {
    nodesData.forEach((nodData, id) => {
      if (nodData.ui_props.details === true) {
        setNodeData(id, {
          ...nodData,
          ui_props: { ...nodData.ui_props, details: false },
        });
      }
    });
  };

  // Keep this comment until execution is deleted
  // const onNodeClick = (_event: MouseEvent, element: Node) => {
  //   if (
  //     !(
  //       element.data.task_props.task_type === 'executionSteps' &&
  //       element.type === 'executionSteps'
  //     )
  //   ) {
  //     setSelectedElement({ type: 'node', id: element.id });
  //   }
  // };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const onDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (workingGraph.graph.id === graphId) {
      const stateRF = storeRF.getState();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
      };
      const task_identifier: string = event.dataTransfer.getData(
        'task_identifier'
      );
      const task_type: string = event.dataTransfer.getData('task_type');
      const icon: string = event.dataTransfer.getData('icon');
      const position = rfInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      let tempTask = tasks.find(
        (tas) => tas.task_identifier === task_identifier
      );

      tempTask =
        tempTask || task_type === 'graph'
          ? tempTask
          : {
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
          optional_input_names: tempTask?.optional_input_names,
          output_names: tempTask?.output_names,
          required_input_names: tempTask?.required_input_names,
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
        },
      });
      addNodes(newNode);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to add a new node to any sub-graph!',
        severity: 'success',
      });
    }
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
      nodesData,
      oldEdge
    );
    if (!isValid) {
      setOpenSnackbar({
        open: true,
        text: reason,
        severity: 'warning',
      });
    }
  };

  const onConnect = (params: Connection) => {
    if (workingGraph.graph.id !== graphId) {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to create new links to any sub-graph!',
        severity: 'success',
      });
      return;
    }

    // DATAC to nodes and edges
    const newGraph = addConnectionToGraph(params, {
      graph: graphInfo,
      nodes: getNodes(),
      links: getEdges() as EwoksRFLink[],
    });
    setEdges(newGraph.links);
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

    const nodeTmp = getNode(node.id);
    if (!nodeTmp) {
      return;
    }
    const nodeData = nodesData.get(nodeTmp.id);
    if (!nodeData) {
      return;
    }
    if (nodeData.task_props.task_type === 'graph') {
      if (workingGraph.graph.id !== graphId) {
        addRecentGraph({
          graph: graphInfo,
          nodes: getNodes(),
          links: getEdges() as EwoksRFLink[],
        });
      }
      const subgraph = recentGraphs.find(
        (gr) => gr.graph.id === nodeData.task_props.task_identifier
      );

      if (subgraph?.graph.id) {
        // Both stay. Can it create multiple canvas rerenders to set the both?
        setNodes(subgraph.nodes);

        setNodesData(subgraph.nodes);

        setEdges(subgraph.links);

        setGraphInfo(subgraph.graph);

        setSubgraphsStack({
          id: subgraph.graph.id,
          label: subgraph.graph.label,
        });
        setSelectedElement({ type: 'graph', id: subgraph.graph.id });
      } else {
        setOpenSnackbar({
          open: true,
          text: 'Seems the specific subgraph cannot be located!',
          severity: 'error',
        });
      }
    } else {
      const nodeTmpData: EwoksRFNodeData = {
        ...nodeData,
        ui_props: { ...nodeData?.ui_props, details: true },
      };
      setNodeData(nodeTmp.id, nodeTmpData);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLImageElement>) => {
    const charCode = String.fromCodePoint(event.which).toLowerCase();

    const nodesIds = [...storeRF.getState().nodeInternals.keys()];

    const keys = event.ctrlKey || event.metaKey;
    if (keys && charCode === 'v') {
      event.preventDefault();
      event.stopPropagation();
      if (isNode(selectedElement)) {
        const newClone: EwoksRFNode = {
          ...selectedElement,
          id: calcNewId(selectedElement.id, nodesIds),
          selected: false,
          position: {
            x: (selectedElement.position?.x || 0) + 100,
            y: (selectedElement.position?.y || 0) + 100,
          },
        };
        // Both stay
        setNodes([...getNodes(), newClone]);
        setNodeData(newClone.id, newClone.data);

        setSelectedElement({ type: 'node', id: newClone.id });
      } else {
        setOpenSnackbar({
          open: true,
          text: 'Clone is for cloning nodes within the working workflow',
          severity: 'warning',
        });
      }
    }
  };

  return (
    <div
      className={classes.root}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          fitView
          connectOnClick
          nodesDraggable
          attributionPosition="bottom-right"
          minZoom={0.2}
          snapToGrid
          onPaneClick={() => onPaneClick()}
          onClick={() => setSelectedTask({})}
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
          <Controls />
          <CanvasMiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}

export default Canvas;
