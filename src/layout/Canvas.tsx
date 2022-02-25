/* eslint-disable unicorn/consistent-function-scoping */
import React, { useEffect, useState, MouseEvent, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  useZoomPanHelper,
  Node,
  Edge,
  Background,
  useUpdateNodeInternals,
  ControlButton,
} from 'react-flow-renderer';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// import CustomNode from '../CustomNodes/CustomNode';
import FunctionNode from '../CustomNodes/FunctionNode';
import NoteNode from '../CustomNodes/NoteNode';
import ExecutionStepsNode from '../CustomNodes/ExecutionStepsNode';
import DataNode from '../CustomNodes/DataNode';
import type { GraphRF, EwoksRFNode, EwoksRFLink } from '../types';
import Popover from '../Components/Popover';
import state from '../store/state';

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

// // const nodesIds = new Set();
// const linksIds = new Set();

const getnodesIds = (text: string, nodes: EwoksRFNode[]) => {
  let id = 0;
  while (nodes.map((nod) => nod.id).includes(`${text}_${id}`)) {
    id++;
  }
  return `${text}_${id}`;
};
// const getLinksIds = (links, name) => {
//   let id = 0;
//   while (links.map((link) => link.id).includes(id)) {
//     id++;
//   }
//   // linksIds.add(id);
//   return `link_${id}`;
// };

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

  // const { fitView, fitBounds } = useZoomPanHelper();
  const [rfInstance, setRfInstance] = useState(null);
  // const [disableDragging, setDisableDragging] = useState(false);
  const [elements, setElements] = useState([]);

  const reactFlowWrapper = useRef(null);
  const graphRF = state((state) => state.graphRF);
  const setGraphRF = state((state) => state.setGraphRF);
  const setSubgraphsStack = state((state) => state.setSubgraphsStack);
  const setRecentGraphs = state((state) => state.setRecentGraphs);
  const setUndoRedo = state((state) => state.setUndoRedo);
  const selectedElement = state((state) => state.selectedElement);
  const setSelectedElement = state((state) => state.setSelectedElement);
  const tasks = state((state) => state.tasks);

  const [selectedElements, setSelectedElements] = React.useState([]);

  // const updateNeeded = state((state) => state.updateNeeded);
  const recentGraphs = state((state) => state.recentGraphs);
  const workingGraph = state((state) => state.workingGraph);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const updateNodeInternals = useUpdateNodeInternals();

  const [stepDetails, setStepDetails] = useState(null);

  useEffect(() => {
    setElements([...graphRF.nodes, ...graphRF.links]);
  }, [graphRF]);

  useEffect(() => {
    if (
      rfInstance &&
      elements.length > 0 &&
      workingGraph.graph.id !== graphRF.graph.id
    ) {
      rfInstance.fitView();
    }
  }, [rfInstance, elements, workingGraph.graph.id, graphRF.graph.id]);

  // TODO: examine the usage
  // useEffect(() => {
  //   // fitView();
  //   // fitBounds({ x: 0, y: 0, width: 1000, height: 1000 }, 300);
  //   console.log('useEffect canvas', rfInstance);
  //   if (rfInstance) {
  //     rfInstance.fitView();
  //   }
  // }, [rfInstance]);

  // TODO: examine the usage in add more handles without refreshing
  // Used to update custom node after adding Handles NOT WORKING
  // useEffect(() => {
  //   if ('position' in selectedElement) {
  //     updateNodeInternals(selectedElement.id);
  //   }
  // }, [selectedElement, selectedElement.id, updateNodeInternals]);

  const onElementClick = (event, element: Node | Edge) => {
    const graphElement: EwoksRFNode | EwoksRFLink = elements.find(
      (el) => el.id === element.id
    );

    if ('position' in element) {
      // console.log(element);
      setStepDetails({ evt: event.currentTarget, element });
    }

    setSelectedElement(graphElement);
  };

  const onLoad = (reactFlowInstance) => {
    console.log('onLoad');
    setRfInstance(reactFlowInstance);
    // if (rfInstance) {
    //   rfInstance.fitView();
    // }
  };
  // const handlDisableDragging = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setDisableDragging(event.target.checked);
  // };

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();
    // TODO: examine how to prevent bug on dragging selection of multiple elements
    if (selectedElements.length > 1) {
      return;
    }
    if (graphRF.graph.id === '0') {
      setSubgraphsStack({
        id: graphRF.graph.id,
        label: graphRF.graph.label,
      });
    }

    if (workingGraph.graph.id === graphRF.graph.id) {
      // TODO: calculate optional_input_names, required_input_names, output_names?
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
            ? getnodesIds('In', graphRF.nodes)
            : task_type === 'graphOutput'
            ? getnodesIds('Out', graphRF.nodes)
            : task_type === 'note'
            ? getnodesIds('Note', graphRF.nodes)
            : getnodesIds(task_identifier || 'Node', graphRF.nodes),
        label: task_identifier,
        task_type,
        task_identifier,
        type: task_type,
        task_generator: '',
        position,
        default_inputs: [],
        inputs_complete: false,
        default_error_node: {
          on_error: false,
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
          moreHandles: true,
        },
      };
      // setElements((es) => [...es, newNode]);
      const newGraph = {
        graph: graphRF.graph,
        nodes: [...graphRF.nodes, newNode],
        links: graphRF.links,
      } as GraphRF;
      // setElements((els) => addEdge(params, els));
      setGraphRF(newGraph);
      setUndoRedo({ action: 'Added a Node', graph: newGraph });
      // need to also save it in recentGraphs if we leave and come back to the graph?
      setRecentGraphs(newGraph as GraphRF);
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
    let elements = [];
    // TODO: shouldnt need the following debug why graphRF is not
    // updated inside this function
    setElements((els) => {
      elements = els;
      return els;
    });
    const link = {
      ...oldEdge,
      ...newConnection,
    };
    const newGraph = {
      graph: { ...graphRF.graph },
      nodes: elements.filter((el) => el.position), // [...graphRF.nodes],
      links: [
        ...elements
          .filter((el) => el.source)
          .filter((lin) => lin.id !== oldEdge.id),
        link,
      ], // addEdge(params, graphRF.links),
    };

    setGraphRF(newGraph as GraphRF);
    setUndoRedo({ action: 'Updated a Link', graph: newGraph });
    // need to also save it in recentGraphs if we leave and come back to the graph?

    setRecentGraphs(newGraph as GraphRF);
  };
  // setElements((els) => updateEdge(oldEdge, newConnection, els));

  const onConnect = (params: Edge) => {
    // If it is a link between pre-existing nodes:
    // add links_required_output_names and links_optional_output_names from target
    // links_input_names from source node

    // ELSE IF there is a new node we need to find input and outputs
    // console.log(params);
    if (workingGraph.graph.id === graphRF.graph.id) {
      const sourceTask = graphRF.nodes.find((nod) => nod.id === params.source);
      const targetTask = graphRF.nodes.find((nod) => nod.id === params.target);
      const link = {
        data: {
          on_error: false,
          comment: '',
          // node optional_input_names are link's optional_output_names
          links_optional_output_names: targetTask.optional_input_names,
          // node required_input_names are link's required_output_names
          links_required_output_names: targetTask.required_input_names,
          // node output_names are link's input_names
          links_input_names: sourceTask.output_names,
          conditions: [],
          data_mapping: [],
          map_all_data: false,
          // TODO: calculate if it is a graph
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
        arrowHeadType: 'arrowclosed',
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

  const onRightClick = (event) => {
    event.preventDefault();
    updateNodeInternals(selectedElement.id);
  };

  const onSelectionChange = (elements) => {
    if (!elements) {
      setSelectedElement(graphRF.graph);
      setSelectedElements([]);
    } else if (elements.length > 1) {
      setSelectedElements(elements);
    } else {
      setSelectedElements([]);
    }
  };

  const onNodeDoubleClick = (event, node) => {
    event.preventDefault();
    const nodeTmp = graphRF.nodes.find((el) => el.id === node.id);
    if (nodeTmp.task_type === 'graph') {
      // if type==graph get the subgraph from the recentGraphs (and if not from server?)
      // TODO: clear the relation of task_identifier and the id of a subgraph...
      // The same subgraph inserted twice in a superGraph must have its own id
      // create a unique id for this graph

      const subgraph = recentGraphs.find(
        (gr) => gr.graph.id === nodeTmp.task_identifier
      );
      if (subgraph && subgraph.graph.id) {
        // TODO: if the subgraph does not exist on recent? Re-ask server and failsafe
        setGraphRF(subgraph);
        setSubgraphsStack({
          id: subgraph.graph.id,
          label: subgraph.graph.label,
        });
      }
    } else {
      // TODO: need doubleClick on simple nodes?
    }
  };

  // const onNodeMouseMove = (event, node) => {
  //   event.preventDefault();
  //   // console.log(event, node);
  // };

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

  const onSelectionDrag = (event) => {
    event.preventDefault();
    // // console.log(event, selectedElements);
  };

  // const onNodeDrag = (event, node) => {
  //   event.preventDefault();
  //   // console.log(event, node);
  // };

  const onNodeDragStop = (event, node) => {
    event.preventDefault();
    if (workingGraph.graph.id === graphRF.graph.id) {
      // find RFEwoksNode and update its position and save grapRF
      const RFEwoksNode: EwoksRFNode = {
        ...graphRF.nodes.find((nod) => nod.id === node.id),
      };
      RFEwoksNode.position = node.position;
      const newGraph = {
        graph: graphRF.graph,
        nodes: [
          ...graphRF.nodes.filter((nod) => nod.id !== node.id),
          RFEwoksNode,
        ],
        links: graphRF.links,
      };

      setSelectedElement(RFEwoksNode); // ? test if after drag the selected node should be set

      setGraphRF(newGraph as GraphRF);
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

  const onElementsRemove = (elementsToRemove) => {
    let newGraph = {} as GraphRF;
    // TODO: make it work for multiple delete?
    // TODO: same code as sidebar->deleteElement create a hook for delete?
    const el = elementsToRemove[0];
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
  };

  return (
    <div className={classes.root}>
      <ReactFlowProvider>
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
            // defaultPosition={[-200, -200]}
            minZoom={0.2}
            snapToGrid
            // onPaneClick={(e) => console.log(e)}
            // snapGrid={[150, 150]}
            onMoveStart={(e) => console.log(e)}
            onMoveEnd={(e) => console.log(e)}
            elements={elements}
            // onElementClick={onElementClick}
            onElementClick={(evt, node) => {
              onElementClick(evt, node);
              if (node.type !== 'smoothstep')
                setStepDetails({ evt: evt.currentTarget, node });
            }}
            onLoad={onLoad}
            onDrop={onDrop}
            onConnect={onConnect}
            onEdgeUpdate={onEdgeUpdate}
            onDragOver={onDragOver}
            onPaneContextMenu={onRightClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onSelectionChange={onSelectionChange}
            // onNodeMouseMove={onNodeMouseMove}
            onSelectionDragStop={onSelectionDragStop}
            onSelectionDrag={onSelectionDrag}
            // onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            onElementsRemove={onElementsRemove}
            deleteKeyCode="Delete"
          >
            <Controls onFitView={() => console.log('ok')}>
              <ControlButton
                onClick={
                  () => fitView({ padding: 0.2, includeHiddenNodes: true })
                  // fitBounds({ x: 0, y: 0, width: 1000, height: 1000 }, 300)
                }
              >
                act
              </ControlButton>
            </Controls>

            <Background />
          </ReactFlow>
          {/* <Popover
            anchor={stepDetails?.evt || null}
            onClose={() => setStepDetails(null)}
            nodeData={stepDetails?.node || null}
            // onBottom={true}
          /> */}
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default Canvas;
