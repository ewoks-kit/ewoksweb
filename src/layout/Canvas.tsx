/* eslint-disable unicorn/consistent-function-scoping */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Controls,
  MiniMap,
  Node,
  Edge,
  Background,
  Connection,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  useUpdateNodeInternals,
} from 'react-flow-renderer';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import bendingText from '../CustomEdges/BendingTextEdge';
import getAround from '../CustomEdges/GetAroundEdge';

import FunctionNode from '../CustomNodes/FunctionNode';
import NoteNode from '../CustomNodes/NoteNode';
import ExecutionStepsNode from '../CustomNodes/ExecutionStepsNode';
import DataNode from '../CustomNodes/DataNode';
import type { GraphRF, EwoksRFNode, EwoksRFLink } from '../types';
import state from '../store/state';
import { calcNewId } from '../utils/calcNewId';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
  })
);

const getnodesIds = (text: string, nodes: EwoksRFNode[]) => {
  let id = 0;
  while (nodes.map((nod) => nod.id).includes(`${text}_${id}`)) {
    id++;
  }
  return `${text}_${id}`;
};

const edgeTypes = {
  bendingText,
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

  const [rfInstance, setRfInstance] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [prevGraphId, setPrevGraphId] = useState('');

  const reactFlowWrapper = useRef(null);

  const graphRF = state((state) => state.graphRF);
  const setGraphRF = state((state) => state.setGraphRF);
  const setSubgraphsStack = state((state) => state.setSubgraphsStack);
  const subgraphsStack = state((state) => state.subgraphsStack);
  const setRecentGraphs = state((state) => state.setRecentGraphs);
  const setUndoRedo = state((state) => state.setUndoRedo);
  const setSelectedElement = state((state) => state.setSelectedElement);
  const selectedElement = state((state) => state.selectedElement);
  const setSelectedTask = state((state) => state.setSelectedTask);
  const tasks = state((state) => state.tasks);
  const recentGraphs = state((state) => state.recentGraphs);
  const workingGraph = state((state) => state.workingGraph);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const updateNodeInternals = useUpdateNodeInternals();

  // const [stepDetails, setStepDetails] = useState(null);

  const { fitView } = useReactFlow();
  // TODO: when selecting a node-link selected fires the re-render
  // since graphRF changes. We need to not rerender
  // Accosiated edges titles flicker when selecting a node and then select graph
  useEffect(() => {
    // console.log(graphRF);

    setNodes(graphRF.nodes);
    setEdges(graphRF.links);
  }, [graphRF.nodes, graphRF.links]);

  useEffect(() => {
    // console.log(prevGraphId);

    if ('position' in selectedElement) {
      setTimeout(() => {
        updateNodeInternals(selectedElement.id);
      }, 400);
    }

    if (prevGraphId !== graphRF.graph.id) {
      setTimeout(() => {
        fitView();
      }, 100);
    }

    if (subgraphsStack[subgraphsStack.length - 1]) {
      setPrevGraphId(subgraphsStack[subgraphsStack.length - 1].id);
    }
  }, [
    graphRF.graph.id,
    fitView,
    subgraphsStack,
    prevGraphId,
    selectedElement,
    updateNodeInternals,
  ]);

  const onElementsRemove = useCallback(
    (elementsToRemove) => {
      let newGraph = {} as GraphRF;
      const [el] = elementsToRemove;
      if (el.position) {
        const nodesLinks = graphRF.links.filter(
          (link) => !(link.source === el.id || link.target === el.id)
        );

        newGraph = {
          ...graphRF,
          nodes: graphRF.nodes.filter((nod) => nod.id !== el.id),
          links: nodesLinks,
        };
        setUndoRedo({ action: 'Removed a Node', graph: newGraph });
      } else if (el.source) {
        newGraph = {
          ...graphRF,
          links: graphRF.links.filter((link) => link.id !== el.id),
        };
        setUndoRedo({ action: 'Removed a Link', graph: newGraph });
      }
      setGraphRF(newGraph);
    },
    [graphRF, setGraphRF, setUndoRedo]
  );

  const onNodesChange = useCallback(
    (changes) => {
      const node = [...graphRF.nodes].find((el) => el.id === changes[0].id);
      console.log(node);

      // TODO: nodes are updated only on rf canvas and not on graphRF
      // if we update graphRF we have a loop so we update on setSelectedElement
      // where we set every other selected to false... SOLUTION

      setNodes((ns) => {
        return applyNodeChanges(changes, ns);
      });

      if (changes[0].type === 'remove') {
        onElementsRemove([node]);
      }
    },
    [onElementsRemove, graphRF.nodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      // console.log(changes);
      const edgeToRemove = graphRF.links.find((el) => el.id === changes[0].id);
      // setNodes((ns) => applyNodeChanges(changes, ns));

      if (changes[0].type === 'remove') {
        onElementsRemove([edgeToRemove]);
      }
      setEdges((es) => applyEdgeChanges(changes, es));
    },
    [onElementsRemove, graphRF.links]
  );

  // const onSelectionChange = (elements) => {
  //   // console.log(elements);
  //   // if (elements.nodes.length === 0 && elements.edges.length === 0) {
  //   //   setSelectedElement(graphRF.graph);
  //   // }
  // };

  const onPaneClick = () => {
    setSelectedElement(graphRF.graph);
  };

  const onNodeClick = (event, element?: Node) => {
    const graphElement: EwoksRFNode = nodes.find((el) => el.id === element.id);
    console.log(graphElement);
    setSelectedElement(graphElement);
  };

  const onEdgeClick = (event, element?: Edge) => {
    const graphElement: EwoksRFLink = edges.find((el) => el.id === element.id);
    setSelectedElement(graphElement);
  };

  const onInit = useCallback((instance) => {
    setRfInstance(instance);
  }, []);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();

    if (graphRF.graph.id === '0') {
      setSubgraphsStack({
        id: graphRF.graph.id,
        label: graphRF.graph.label,
      });
    }

    if (workingGraph.graph.id === graphRF.graph.id) {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const task_identifier = event.dataTransfer.getData('task_identifier');
      const task_type = event.dataTransfer.getData('task_type');
      const icon = event.dataTransfer.getData('icon');
      const position = rfInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      let tempTask = tasks.find(
        (tas) => tas.task_identifier === task_identifier
      );
      tempTask = tempTask
        ? tempTask // if you found the Task return it
        : task_type === 'graph' // if not found check if it is a graph ???
        ? tempTask // if a graph return it and if not add some default inputs-outputs
        : {
            optional_input_names: [],
            output_names: [],
            required_input_names: [],
          };

      const newNode = {
        id:
          task_type === 'graphInput'
            ? calcNewId('In', graphRF.nodes)
            : task_type === 'graphOutput'
            ? calcNewId('Out', graphRF.nodes)
            : task_type === 'note'
            ? calcNewId('Note', graphRF.nodes)
            : calcNewId(task_identifier || 'Node', graphRF.nodes),
        label: task_identifier,
        task_type,
        task_identifier,
        type: task_type,
        task_generator: '',
        position,
        default_inputs: [],
        inputs_complete: false,
        default_error_node: false,
        default_error_attributes: {
          map_all_data: true,
          data_mapping: [],
        },
        optional_input_names: tempTask.optional_input_names,
        output_names: tempTask.output_names,
        required_input_names: tempTask.required_input_names,
        data: {
          label: task_identifier,
          type: 'internal',
          icon,
          moreHandles: false,
        },
      };

      const newGraph = {
        graph: graphRF.graph,
        nodes: [...graphRF.nodes, newNode],
        links: graphRF.links,
      } as GraphRF;

      setGraphRF(newGraph);
      setUndoRedo({ action: 'Added a Node', graph: newGraph });
      // need to also save it in recentGraphs if we leave and come back to the graph?
      setRecentGraphs(newGraph);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to add a new node to any sub-graph!',
        severity: 'success',
      });
    }
  };

  const onEdgeUpdate = (oldEdge, newConnection) => {
    // console.log(oldEdge, newConnection);
    const link = {
      ...oldEdge,
      ...newConnection,
    };
    const newGraph = {
      graph: { ...graphRF.graph },
      nodes: nodes.filter((el) => el.position), // [...graphRF.nodes],
      links: [
        ...edges
          .filter((el) => el.source)
          .filter((lin) => lin.id !== oldEdge.id),
        link,
      ],
    };

    setGraphRF(newGraph as GraphRF);
    setUndoRedo({ action: 'Updated a Link', graph: newGraph });
    setRecentGraphs(newGraph as GraphRF);
  };

  const onConnect = (params: Connection) => {
    // console.log(params);
    if (workingGraph.graph.id === graphRF.graph.id) {
      const sourceTask = graphRF.nodes.find((nod) => nod.id === params.source);
      const targetTask = graphRF.nodes.find((nod) => nod.id === params.target);
      // TODO: take link out
      const link = {
        data: {
          on_error: false,
          comment: '',
          // node optional_input_names are link's optional_output_names
          links_optional_output_names: targetTask.optional_input_names || [],
          // node required_input_names are link's required_output_names
          links_required_output_names: targetTask.required_input_names || [],
          // node output_names are link's input_names
          links_input_names: sourceTask.output_names || [],
          conditions: [],
          data_mapping: [],
          map_all_data: false,
          sub_source:
            sourceTask.task_type === 'graph' ? params.sourceHandle : '',
          sub_target:
            targetTask.task_type === 'graph' ? params.targetHandle : '',
        },
        id: `${params.source}:${params.sourceHandle}->${params.target}:${params.targetHandle}`,
        label: `${params.source.slice(0, 6)}->${params.target.slice(0, 6)}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        type: 'default',
        animated: false,
        markerEnd: { type: 'arrowclosed' },
        style: { stroke: '#96a5f9', strokeWidth: '2.5' },
        labelBgStyle: {
          fill: 'rgb(223, 226, 247)',
          color: 'rgb(50, 130, 219)',
          fillOpacity: 1,
        },
        labelBgPadding: [8, 4],
        labelBgBorderRadius: 4,
        labelStyle: { fill: 'blue', fontWeight: 500, fontSize: 14 },
        startEnd:
          sourceTask.task_type === 'graphInput' ||
          targetTask.task_type === 'graphOutput',
      };

      const newGraph = {
        graph: graphRF.graph,
        nodes: graphRF.nodes,
        links: [...graphRF.links, link], // addEdge(params, graphRF.links),
      };
      // setElements((els) => addEdge(params, els));
      setGraphRF(newGraph as GraphRF);
      // need to also save it in recentGraphs if we leave and come back to the graph?
      setRecentGraphs(newGraph as GraphRF);

      // add action and new GraphRF to undo-redo array
      setUndoRedo({ action: 'new Link', graph: newGraph as GraphRF });
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to create new links to any sub-graph!',
        severity: 'success',
      });
    }
  };

  const onPaneContextMenu = (event) => {
    event.preventDefault();
    setOpenSnackbar({
      open: true,
      text: 'Show some choises?',
      severity: 'success',
    });
  };

  // const onNodeContextMenu = (event: React.MouseEvent, nodes: Node) => {
  //   event.preventDefault();
  //   // console.log(nodes);
  //   setOpenSnackbar({
  //     open: true,
  //     text: nodes[0].id,
  //     severity: 'success',
  //   });
  // };

  const onNodeDoubleClick = (event, node) => {
    event.preventDefault();
    const nodeTmp = graphRF.nodes.find((el) => el.id === node.id);
    if (nodeTmp.task_type === 'graph') {
      // if type==graph get the subgraph from the recentGraphs
      const subgraph = recentGraphs.find(
        (gr) => gr.graph.id === nodeTmp.task_identifier
      );
      if (subgraph && subgraph.graph.id) {
        setGraphRF(subgraph);
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
    } else {
      // TODO: need doubleClick on simple nodes?
    }
  };

  const onSelectionDragStart = (event) => {
    event.preventDefault();
  };

  const onSelectionDrag = (event) => {
    event.preventDefault();
  };

  const onSelectionDragStop = (event, selectedElements) => {
    event.preventDefault();
    if (workingGraph.graph.id === graphRF.graph.id) {
      // find selectedElements and update its position and save grapRF
      const newElements = [];
      const newElementsIds = [];
      selectedElements.forEach((el) => {
        const rfNode = { ...graphRF.nodes.find((nod) => nod.id === el.id) };
        rfNode.position = el.position;
        newElements.push(rfNode);
        newElementsIds.push(rfNode.id);
      });

      const newGraph = {
        graph: graphRF.graph,
        nodes: [
          ...graphRF.nodes.filter((nod) => !newElementsIds.includes(nod.id)),
          ...newElements,
        ],
        links: graphRF.links,
      };

      setGraphRF(newGraph as GraphRF);
      setUndoRedo({
        action: 'Dragged a selection',
        graph: newGraph as GraphRF,
      });
      setRecentGraphs(newGraph);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Any positional change in any subgraph wont be saved!',
        severity: 'success',
      });
    }
  };

  // const onSelectionDrag = (event) => {
  //   event.preventDefault();
  // };

  const onNodeDragStop = (event, node) => {
    // console.log(node);
    event.preventDefault();
    if (workingGraph.graph.id === graphRF.graph.id) {
      // find RFEwoksNode and update its position and save grapRF
      const RFEwoksNode: EwoksRFNode = {
        ...graphRF.nodes.find((nod) => nod.id === node.id),
      };
      RFEwoksNode.position = node.position;
      const newGraph: GraphRF = {
        graph: graphRF.graph,
        nodes: [
          ...graphRF.nodes.filter((nod) => nod.id !== node.id),
          RFEwoksNode,
        ],
        links: graphRF.links,
      };

      // setSelectedElement(RFEwoksNode); // ? test if after drag the selected node should be set

      setGraphRF(newGraph);
      setUndoRedo({ action: 'Dragged a Node', graph: newGraph });
      // need to also save it in recentGraphs if we leave and come back to the graph?
      setRecentGraphs(newGraph);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Any positional change in any subgraph wont be saved!',
        severity: 'success',
      });
    }
  };

  const onClick = () => {
    setSelectedTask({});
  };

  // in case we need on canvas buttons
  // const buttonWrapperStyles: CSSProperties = {
  //   position: 'absolute',
  //   right: 10,
  //   top: 10,
  //   zIndex: 10,
  // };

  return (
    <div className={classes.root}>
      <div
        className="reactflow-wrapper"
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: '#e9ebf7',
        }}
        ref={reactFlowWrapper}
      >
        <ReactFlow
          fitView
          connectOnClick
          nodesDraggable
          attributionPosition="bottom-right"
          // defaultPosition={[-200, -200]}
          minZoom={0.2}
          snapToGrid
          nodes={nodes}
          edges={edges}
          onNodeClick={(evt, node) => {
            onNodeClick(evt, node);
          }}
          onEdgeClick={(evt, node) => {
            onEdgeClick(evt, node);
          }}
          onPaneClick={onPaneClick}
          onClick={onClick}
          onInit={onInit}
          onDrop={onDrop}
          onConnect={onConnect}
          onEdgeUpdate={onEdgeUpdate}
          onDragOver={onDragOver}
          onPaneContextMenu={onPaneContextMenu}
          // onNodeContextMenu={(evt, node) => {
          //   onNodeContextMenu(evt, node);
          // }}
          onNodeDoubleClick={onNodeDoubleClick}
          // onSelectionChange={onSelectionChange}
          // onNodeMouseMove={onNodeMouseMove}
          onSelectionDragStop={onSelectionDragStop}
          onSelectionDragStart={onSelectionDragStart}
          onSelectionDrag={onSelectionDrag}
          // onNodeDrag={onNodeDrag}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          // elevateEdgesOnSelect
          // TODO: deleteKey does not work properly
          // deleteKeyCode="Delete"
        >
          {/* <div style={buttonWrapperStyles}>
            <button type="button" onClick={updateNode}>
              update node internals
            </button>
          </div> */}
          <Controls>
            {/* <ControlButton
                onClick={
                  () =>
                    rfInstance.fitView({
                      padding: 0.2,
                      includeHiddenNodes: true,
                    })
                  rfInstance.fitBounds({ x: 0, y: 0, width: 1000, height: 1000 }, 300)
                }
              >
                act
              </ControlButton> */}
          </Controls>
          <MiniMap
            nodeStrokeColor={(n): string => {
              // "rgb(60, 81, 202)"
              if (n.style?.background) {
                return n.style.background as string;
              }
              if (['graphOutput', 'graphInput'].includes(n.type)) {
                return '#0041d0';
              }
              if (n.type === 'graph') {
                return '#ff0072';
              }
              // if (n.type === 'default') return 'rgb(60, 81, 202)';

              return 'rgb(60, 81, 202)';
            }}
            nodeColor={(n): string => {
              if (n.style?.background) {
                return n.style.background as string;
              }
              if (['graphOutput', 'graphInput'].includes(n.type)) {
                return 'rgb(223, 226, 247)';
              }
              if (n.type === 'graph') {
                return 'rgba(244, 179, 131, 0.87)';
              }
              // if (n.type === 'default') return 'rgb(60, 81, 202)';

              return 'rgb(60, 81, 202)';
            }}
            nodeBorderRadius={2}
          />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

export default Canvas;
