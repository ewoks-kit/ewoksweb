import type { DragEventHandler, MouseEvent } from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow';
import ReactFlow, {
  Controls,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  useUpdateNodeInternals,
} from 'reactflow';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import bendingText from 'CustomEdges/BendingTextEdge';
import multilineText from 'CustomEdges/MultilineTextEdge';
import getAround from 'CustomEdges/GetAroundEdge';

import FunctionNode from 'CustomNodes/FunctionNode';
import NoteNode from 'CustomNodes/NoteNode';
import ExecutionStepsNode from 'CustomNodes/ExecutionStepsNode';
import DataNode from 'CustomNodes/DataNode';
import type { GraphRF, EwoksRFNode, EwoksRFLink } from 'types';
import useStore from 'store/useStore';
import { calcNewId } from 'utils/calcNewId';
import isValidLink from 'utils/IsValidLink';
import CanvasBackground from './CanvasBackground';
import { isNode } from 'utils/typeGuards';
import CanvasMiniMap from './CanvasMiniMap';
import { addConnectionToGraph, trimLabel } from './utils';
import { useStoreApi } from 'reactflow';

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

  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const subgraphsStack = useStore((state) => state.subgraphsStack);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const setUndoRedo = useStore((state) => state.setUndoRedo);
  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const selectedElement = useStore((state) => state.selectedElement);
  const setSelectedTask = useStore((state) => state.setSelectedTask);
  const tasks = useStore((state) => state.tasks);
  const recentGraphs = useStore((state) => state.recentGraphs);
  const workingGraph = useStore((state) => state.workingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const updateNodeInternals = useUpdateNodeInternals();

  const { fitView, getZoom, zoomTo } = rfInstance;

  useEffect(() => {
    storeRF.getState().setNodes(workingGraph.nodes);
    storeRF.getState().setEdges(workingGraph.links);
  }, [workingGraph.nodes, workingGraph.links, storeRF]);

  // TBD when selectedElement changes updates the canvas directly
  useEffect(() => {
    storeRF.getState().setNodes(graphRF.nodes);
    storeRF.getState().setEdges(graphRF.links);
  }, [graphRF.nodes, graphRF.links, storeRF]);

  useEffect(() => {
    if (!isNode(selectedElement)) {
      return;
    }

    const timeoutPosition = setTimeout(() => {
      updateNodeInternals(selectedElement.id);
    }, 400);
    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeoutPosition);
  }, [selectedElement, updateNodeInternals]);

  useEffect(() => {
    if (subgraphsStack[subgraphsStack.length - 1]) {
      setPrevGraphId(subgraphsStack[subgraphsStack.length - 1].id);
    }
  }, [subgraphsStack]);

  useEffect(() => {
    if (prevGraphId !== graphRF.graph.id) {
      const nodesLength = storeRF.getState().getNodes().length;

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
  }, [storeRF, graphRF.graph.id, fitView, getZoom, zoomTo, prevGraphId]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      storeRF
        .getState()
        .setNodes(applyNodeChanges(changes, storeRF.getState().getNodes()));
    },
    [storeRF]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      storeRF
        .getState()
        .setEdges(applyEdgeChanges(changes, storeRF.getState().edges));
    },
    [storeRF]
  );

  const onPaneClick = () => {
    setSelectedElement(graphRF.graph);
  };

  const onNodeClick = (_event: MouseEvent, element: Node) => {
    const nodesRF = [...storeRF.getState().nodeInternals.values()];
    const graphElement: EwoksRFNode | undefined = nodesRF.find(
      (el) => el.id === element.id
    );

    if (
      graphElement &&
      isNode(graphElement) &&
      !(
        graphElement.data.task_props.task_type === 'executionSteps' &&
        graphElement.type === 'executionSteps'
      ) &&
      // is not already selected
      selectedElement.id !== graphElement.id
    ) {
      setSelectedElement(graphElement);
    }
  };

  const onEdgeClick = (_event: MouseEvent, element: Edge) => {
    setSelectedElement(element as EwoksRFLink);
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const onDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    if (workingGraph.graph.id === graphRF.graph.id) {
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

      const newNode: EwoksRFNode = {
        id:
          task_type === 'graphInput'
            ? calcNewId('In', nodesIds)
            : task_type === 'graphOutput'
            ? calcNewId('Out', nodesIds)
            : task_type === 'note'
            ? calcNewId('Note', nodesIds)
            : calcNewId(task_identifier || 'Node', nodesIds),
        type: task_type,

        position,

        data: {
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
        },
      };

      storeRF.getState().setNodes([...stateRF.getNodes(), newNode]);

      // TBD
      const newGraph: GraphRF = {
        graph: graphRF.graph,
        nodes: [...graphRF.nodes, newNode],
        links: graphRF.links,
      };

      setGraphRF(newGraph, true);

      setUndoRedo({ action: 'Added a Node', graph: newGraph });
      setRecentGraphs(newGraph);
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
    const nodesRF = [...storeRF.getState().nodeInternals.values()];
    const edgesRF = storeRF.getState().edges;
    const { isValid, reason } = isValidLink(
      newConnection,
      { nodes: nodesRF, links: edgesRF as EwoksRFLink[], graph: graphRF.graph },
      oldEdge
    );
    if (!isValid) {
      setOpenSnackbar({
        open: true,
        text: reason,
        severity: 'warning',
      });
    } else {
      // TODO: examine why there is filtering in nodes and links
      // probably TBD
      const newGraph: GraphRF = {
        graph: { ...graphRF.graph },

        nodes: nodesRF.filter((el) => el.position),
        links: [
          ...edgesRF
            .filter((el) => el.source)
            .filter((lin) => lin.id !== oldEdge.id),
        ] as EwoksRFLink[],
      };

      setGraphRF(newGraph, true);
      setUndoRedo({ action: 'Updated a Link', graph: newGraph });
      setRecentGraphs(newGraph);
    }
  };

  const onConnect = (params: Connection) => {
    if (workingGraph.graph.id !== graphRF.graph.id) {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to create new links to any sub-graph!',
        severity: 'success',
      });
      return;
    }

    // TBD or refactor addConnectionToGraph wont need graphRF
    const newGraph = addConnectionToGraph(params, graphRF);
    storeRF.getState().setEdges(newGraph.links);
    setGraphRF(newGraph, true);

    setRecentGraphs(newGraph);
    setUndoRedo({ action: 'new Link', graph: newGraph });
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

    const nodeTmp = storeRF.getState().nodeInternals.get(node.id);

    if (nodeTmp?.data.task_props.task_type === 'graph') {
      const subgraph = recentGraphs.find(
        (gr) => gr.graph.id === nodeTmp.data.task_props.task_identifier
      );

      if (subgraph?.graph.id) {
        storeRF.getState().setNodes(subgraph.nodes);
        storeRF.getState().setEdges(subgraph.links);
        // TBD
        setGraphRF(subgraph);

        setSubgraphsStack({
          id: subgraph.graph.id,
          label: subgraph.graph.label,
        });
        setSelectedElement({
          ...subgraph.graph,
        });
      } else {
        setOpenSnackbar({
          open: true,
          text: 'Seems the specific subgraph cannot be located!',
          severity: 'error',
        });
      }
    } else {
      if (nodeTmp) {
        storeRF.getState().setNodes([
          ...storeRF
            .getState()
            .getNodes()
            .filter((nod) => nod.id !== nodeTmp.id),
          {
            ...nodeTmp,
            data: {
              ...nodeTmp.data,
              ui_props: { ...nodeTmp.data.ui_props, details: true },
            },
          },
        ]);
      }
    }
  };

  const onSelectionDragStop = (
    event: MouseEvent,
    selectedElements: EwoksRFNode[]
  ) => {
    event.preventDefault();
    // graphRF.graph.id stays as is in the store
    if (workingGraph.graph.id === graphRF.graph.id) {
      // Get them from RF
      const { nodes: graphNodes } = graphRF;

      const selectedIds = selectedElements.map((e) => e.id);

      // TBD
      const newNodes = graphNodes.map((n) => {
        const selectedIndex = selectedIds.indexOf(n.id);
        if (selectedIndex >= 0) {
          return {
            ...n,
            position: selectedElements[selectedIndex].position,
          };
        }

        return n;
      });

      // TBD
      const newGraph: GraphRF = {
        graph: graphRF.graph,
        nodes: newNodes,
        links: graphRF.links,
      };
      setGraphRF(newGraph, true);

      // Replace newGraph with RF
      setUndoRedo({
        action: 'Dragged a selection',
        graph: newGraph,
      });
      setRecentGraphs(newGraph);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Any positional change in any subgraph wont be saved!',
        severity: 'warning',
      });
    }
  };

  // TBD when graphRF removed. Only needed for setRecentGraphs, undoRedo
  const onNodeDragStop = (event: MouseEvent, draggedNode: EwoksRFNode) => {
    event.preventDefault();
    // graphRF.graph.id stays as is in the store
    if (workingGraph.graph.id === graphRF.graph.id) {
      // const { nodes: graphNodes } = graphRF;

      const nodesRF = [...storeRF.getState().nodeInternals.values()];

      // This is not needed probably
      const newNodes = nodesRF.map((n) => {
        if (n.id === draggedNode.id) {
          return {
            ...n,
            position: draggedNode.position,
          };
        }

        return n;
      });
      const newGraph: GraphRF = {
        graph: graphRF.graph,
        nodes: newNodes,
        links: graphRF.links,
      };
      // TBD
      setGraphRF(newGraph, true);

      setUndoRedo({ action: 'Dragged a Node', graph: newGraph });
      setRecentGraphs(newGraph);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Any positional change in any subgraph wont be saved!',
        severity: 'warning',
      });
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
        storeRF
          .getState()
          .setNodes([...storeRF.getState().getNodes(), newClone]);

        // TBD
        setGraphRF(
          {
            ...graphRF,
            nodes: [...graphRF.nodes, newClone],
          },
          true
        );

        setSelectedElement(newClone);
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
          nodes={[...storeRF.getState().nodeInternals.values()]}
          edges={storeRF.getState().edges}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          onClick={() => setSelectedTask({})}
          onDrop={onDrop}
          onConnect={onConnect}
          onEdgeUpdate={onEdgeUpdate}
          onDragOver={onDragOver}
          onPaneContextMenu={onPaneContextMenu}
          onNodeDoubleClick={onNodeDoubleClick}
          onSelectionDragStop={onSelectionDragStop}
          onSelectionDragStart={(e) => e.preventDefault()}
          onSelectionDrag={(e) => e.preventDefault()}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
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
