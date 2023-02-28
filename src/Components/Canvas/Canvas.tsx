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
import type { GraphRF, EwoksRFNode, EwoksRFLink, EwoksRFLinkData } from 'types';
import useStore from 'store/useStore';
import { calcNewId } from 'utils/calcNewId';
import isValidLink from 'utils/IsValidLink';
import CanvasBackground from './CanvasBackground';
import { isNode, isLink } from 'utils/typeGuards';
import CanvasMiniMap from './CanvasMiniMap';
import { addConnectionToGraph, trimLabel } from './utils';
import { useNodesIds, useNodesLength } from '../../store/graph-hooks';

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

  const nodesIds = useNodesIds();
  const nodesLength = useNodesLength();

  const rfInstance = useReactFlow();
  const [nodes, setNodes] = useState<EwoksRFNode[]>([]);
  const [edges, setEdges] = useState<EwoksRFLink[]>([]);
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
    setNodes(graphRF.nodes);
    setEdges(graphRF.links);
  }, [graphRF.nodes, graphRF.links]);

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
  }, [graphRF.graph.id, fitView, getZoom, zoomTo, nodesLength, prevGraphId]);

  const onElementsRemove = useCallback(
    (el: EwoksRFNode | EwoksRFLink) => {
      // TODO: multiple delete investigate

      if (isNode(el)) {
        const nodesLinks = graphRF.links.filter(
          (link) => !(link.source === el.id || link.target === el.id)
        );

        const newGraph: GraphRF = {
          ...graphRF,
          nodes: graphRF.nodes.filter((nod) => nod.id !== el.id),
          links: nodesLinks,
        };
        setGraphRF(newGraph, true);
        setUndoRedo({ action: 'Removed a Node', graph: newGraph });
        return;
      }

      if (isLink(el)) {
        const newGraph: GraphRF = {
          ...graphRF,
          links: graphRF.links.filter((link) => link.id !== el.id),
        };
        setGraphRF(newGraph, true);
        setUndoRedo({ action: 'Removed a Link', graph: newGraph });
        return;
      }

      throw new Error('Expected a link or a node for deletion');
    },
    [graphRF, setGraphRF, setUndoRedo]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // TODO: need examination based on comments and commented code
      // if (changes[0].type === 'dimensions') {
      //   return;
      // }

      // TODO: on click another node it is activated twice once with both
      // and then with the current??

      const change = changes[0];
      if (change.type === 'remove') {
        const node = [...graphRF.nodes].find((el) => el.id === change.id);
        if (node) {
          onElementsRemove(node);
        }
      }

      // TODO: nodes are updated only on rf canvas and not on graphRF
      // if we update graphRF we have a loop so we update on setSelectedElement
      // where we set every other selected to false... Examine

      setNodes((ns) => applyNodeChanges(changes, ns));
    },
    [onElementsRemove, graphRF.nodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const change = changes[0];
      if ('id' in change && changes[0].type === 'remove') {
        const edgeToRemove = graphRF.links.find((el) => el.id === change.id);
        if (edgeToRemove) {
          onElementsRemove(edgeToRemove);
        }
      }

      setEdges((es) => {
        const newEdges = applyEdgeChanges<EwoksRFLinkData>(changes, es);
        // Needed to force `data to not be optional. See EwoksRFLink in src/types.
        return newEdges as EwoksRFLink[];
      });
    },
    [onElementsRemove, graphRF.links]
  );

  const onPaneClick = () => {
    setSelectedElement(graphRF.graph);
  };

  // TODO: this function only handles selected element which is done by RF11 nicelly.
  // It shouldn't update the whole graph as it is now since selected modifies the GraphRF
  const onNodeClick = (_event: MouseEvent, element: Node) => {
    const graphElement: EwoksRFNode | undefined = nodes.find(
      (el) => el.id === element.id
    );

    if (
      graphElement &&
      'task_type' in graphElement.data.task_props &&
      !(
        graphElement.data.task_props.task_type === 'executionSteps' &&
        graphElement.type === 'executionSteps'
      ) &&
      // is already selected
      selectedElement.id !== graphElement.id
    ) {
      setSelectedElement(graphElement);
    }
  };

  const onEdgeClick = (_event: MouseEvent, element: Edge) => {
    // Needed to force `data to not be optional. See EwoksRFLink in src/types.
    setSelectedElement(element as EwoksRFLink);
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const onDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    if (graphRF.graph.id === '0') {
      setSubgraphsStack({
        id: graphRF.graph.id,
        label: graphRF.graph.label,
      });
    }

    if (workingGraph.graph.id === graphRF.graph.id) {
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
      // if you found the Task or if it is a graph return it else add some default inputs-outputs
      tempTask =
        tempTask || task_type === 'graph'
          ? tempTask
          : {
              optional_input_names: [],
              output_names: [],
              required_input_names: [],
            };

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
    const link = {
      ...oldEdge,
      ...newConnection,
    };

    // DOC: if the new link is:
    // 1. attached to a node-handle where there is already a link or
    // 2. is attached to an input-output already connected to a node then
    // edgeUpdate should not happen and a message informs it is not ewoks-compatible

    const { isValid, reason } = isValidLink(newConnection, graphRF, oldEdge);
    if (!isValid) {
      setOpenSnackbar({
        open: true,
        text: reason,
        severity: 'warning',
      });
    } else {
      const newGraph: GraphRF = {
        graph: { ...graphRF.graph },

        nodes: nodes.filter((el) => el.position),
        links: [
          ...edges

            .filter((el) => el.source)
            .filter((lin) => lin.id !== oldEdge.id),
          // TODO: leave the type like that for now until I examine the RFModels with EwoksRFModels
          (link as unknown) as EwoksRFLink,
        ],
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

    const newGraph = addConnectionToGraph(params, graphRF);

    setGraphRF(newGraph, true);
    // DOC: need to also save it in recentGraphs if we leave and come back
    setRecentGraphs(newGraph);

    // add action and new GraphRF to undo-redo array
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

    const nodeTmp = graphRF.nodes.find((el) => el.id === node.id);
    if (nodeTmp?.data.task_props.task_type === 'graph') {
      // if type==graph get the subgraph from the recentGraphs
      const subgraph = recentGraphs.find(
        (gr) => gr.graph.id === nodeTmp.data.task_props.task_identifier
      );

      if (subgraph?.graph.id) {
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
        setSelectedElement({
          ...nodeTmp,
          data: {
            ...nodeTmp.data,
            ui_props: { ...nodeTmp.data.ui_props, details: true },
          },
        });
      }
    }
  };

  const onSelectionDragStop = (
    event: MouseEvent,
    selectedElements: EwoksRFNode[]
  ) => {
    event.preventDefault();
    if (workingGraph.graph.id === graphRF.graph.id) {
      const { nodes: graphNodes } = graphRF;

      const selectedIds = selectedElements.map((e) => e.id);

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

      const newGraph: GraphRF = {
        graph: graphRF.graph,
        nodes: newNodes,
        links: graphRF.links,
      };

      setGraphRF(newGraph, true);
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

  const onNodeDragStop = (event: MouseEvent, draggedNode: EwoksRFNode) => {
    event.preventDefault();
    if (workingGraph.graph.id === graphRF.graph.id) {
      // DOC: find RFEwoksNode and update its position and save grapRF
      const { nodes: graphNodes } = graphRF;

      const newNodes = graphNodes.map((n) => {
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
          nodes={nodes}
          edges={edges}
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
