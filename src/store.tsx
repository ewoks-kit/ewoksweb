import create from 'zustand';
import type {
  State,
  EwoksRFLink,
  EwoksRFNode,
  GraphRF,
  GraphDetails,
  stackGraph,
  GraphEwoks,
  Action,
  Task,
} from './types';
import { createGraph } from './utils';
import { toRFEwoksNodes } from './utils/toRFEwoksNodes';
import { toRFEwoksLinks } from './utils/toRFEwoksLinks';
import { findAllSubgraphs } from './utils/FindAllSubgraphs';
import axios from 'axios';

const initializedTask = {
  task_identifier: '',
  task_type: '',
  icon: '',
  category: '',
  optional_input_names: [],
  output_names: [],
  required_input_names: [],
};

const initializedGraph = {
  graph: {
    id: 'new_graph000',
    label: 'new_graph000',
    input_nodes: [],
    output_nodes: [],
    uiProps: {},
  },
  nodes: [],
  links: [],
} as GraphRF;

const useStore = create<State>((set, get) => ({
  undoRedo: [] as Action[],

  setUndoRedo: (action: Action) => {
    console.log(action, get().undoIndex, get().undoRedo);
    // check the size of the history-array  not more than 10
    // when undo and the then edit the steps above the current step are erased
    set((state) => ({
      ...state,
      undoRedo: [...get().undoRedo.slice(0, get().undoIndex + 1), action],
      undoIndex: get().undoIndex + 1,
    }));
  },

  undoIndex: 0 as number,

  setUndoIndex: (index) => {
    console.log(index, get().undoIndex, get().undoRedo);
    if (index >= 0 && get().undoRedo.length > index) {
      set((state) => ({
        ...state,
        undoIndex: index,
        graphRF: get().undoRedo[index].graph,
      }));
    } else {
      get().setOpenSnackbar({
        open: true,
        text: 'No more back or forth!',
        severity: 'warning',
      });
    }
  },

  initializedTask,

  initializedGraph,

  tasks: [],
  setTasks: (tasks) => {
    set((state) => ({
      ...state,
      tasks,
    }));
  },

  openDraggableDialog: { open: false, content: {} },

  setOpenDraggableDialog: ({ open, content }) => {
    set((state) => ({
      ...state,
      openDraggableDialog: { open, content },
    }));
  },

  openSnackbar: { open: false, text: '', severity: 'success' },

  setOpenSnackbar: (setOpen) => {
    set((state) => ({
      ...state,
      openSnackbar: setOpen,
    }));
  },

  allWorkflows: [] as { title: string }[],

  setAllWorkflows: (workflows: [{ title: string }]) => {
    set((state) => ({
      ...state,
      allWorkflows: workflows,
    }));
  },

  recentGraphs: [] as GraphRF[],

  setRecentGraphs: (newGraph: GraphRF, reset = false) => {
    let rec = [];
    if (!reset) {
      rec =
        get().recentGraphs.length > 0
          ? get().recentGraphs.filter((gr) => {
              // console.log('GRR:', gr, newGraph);
              return gr.graph.id !== newGraph.graph.id;
            })
          : [];
    }
    if (newGraph.graph) {
      set((state) => ({
        ...state,
        recentGraphs: [...rec, newGraph],
      }));
    } else {
      set((state) => ({
        ...state,
        recentGraphs: [...rec],
      }));
    }
  },

  graphOrSubgraph: true as Boolean,

  setGraphOrSubgraph: (isItGraph: Boolean) => {
    set((state) => ({
      ...state,
      graphOrSubgraph: isItGraph,
    }));
  },

  // stack has to hold label and id of graph
  subgraphsStack: [
    {
      id: 'new_graph000',
      label: 'new_graph000',
    },
  ] as stackGraph[],

  setSubgraphsStack: (stackGraph: stackGraph) => {
    let stack = [];
    const subStack = get().subgraphsStack;
    const exists = subStack.map((gr) => gr.id).indexOf(stackGraph.id);
    if (stackGraph.id === 'initialiase') {
      stack = [];
    } else if (exists === -1) {
      stack = [...subStack, stackGraph];
    } else if (exists === subStack.length - 1) {
      // TODO: if user insert the same 'graph' and is the first then stack is not updated
      stack = subStack;
    } else {
      // TODO: if the same graph is inserted again lower in the subgraphs this is activated
      // and resets the stack without adding. If it is an addition this stack needs to know it
      // subStack.length = exists + 1;
      stack = subStack.slice(0, exists + 1);
      // stack = ['graph'];
    }
    set((state) => ({
      ...state,
      subgraphsStack: stack,
    }));
  },

  workingGraph: initializedGraph,

  setWorkingGraph: async (workingGraph: GraphEwoks): Promise<GraphRF> => {
    // 1. if it is a new graph opening initialize
    // TODO: remove initialise or id: 0. Send clear messages
    if (get().tasks.length === 0) {
      const tasks = await axios.get('http://localhost:5000/tasks');
      get().setTasks(tasks.data as Task[]);
    }
    get().setSelectedElement({} as EwoksRFNode | EwoksRFLink);
    get().setSubgraphsStack({ id: 'initialiase', label: '' });
    get().setGraphRF(initializedGraph);
    // Is the following needed as to not get existing graphs? Better an empty array?
    get().setRecentGraphs({} as GraphRF, true);

    const newNodeSubgraphs = await findAllSubgraphs(
      workingGraph,
      get().recentGraphs
    );

    // 3. Put the newNodeSubgraphs into recent in their graphRF form (sync)
    newNodeSubgraphs.forEach((gr) => {
      // calculate the rfNodes using the fetched subgraphs
      get().setRecentGraphs({
        graph: gr.graph,
        nodes: toRFEwoksNodes(gr, newNodeSubgraphs, get().tasks),
        links: toRFEwoksLinks(gr, newNodeSubgraphs, get().tasks),
      });
    });

    // 4. Calculate the new graph given the subgraphs
    let grfNodes = toRFEwoksNodes(workingGraph, newNodeSubgraphs, get().tasks);
    console.log(grfNodes, workingGraph);
    // test notes
    const notes =
      (workingGraph.graph.uiProps &&
        workingGraph.graph.uiProps.notes &&
        workingGraph.graph.uiProps?.notes?.map((note) => {
          return {
            data: {
              label: note.label,
              comment: note.comment,
            },
            id: note.id,
            task_type: 'note',
            task_identifier: note.id,
            type: 'note',
            position: note.position,
          };
        })) ||
      ([] as EwoksRFNode[]);

    grfNodes = [...grfNodes, ...notes];
    console.log(notes, grfNodes);

    const graph = {
      graph: workingGraph.graph,
      nodes: grfNodes,
      links: toRFEwoksLinks(workingGraph, newNodeSubgraphs, get().tasks),
    };

    get().setRecentGraphs(graph as GraphRF);

    // set the new graph as the working graph
    get().setGraphRF(graph as GraphRF);
    get().setSelectedElement(graph.graph);
    // add the new graph to the recent graphs if not already there
    get().setRecentGraphs({
      graph: workingGraph.graph,
      nodes: grfNodes,
      links: toRFEwoksLinks(workingGraph, newNodeSubgraphs, get().tasks),
    });
    get().setSubgraphsStack({
      id: workingGraph.graph.id,
      label: workingGraph.graph.label,
    });
    set((state) => ({
      ...state,
      workingGraph: graph,
      undoRedo: [{ action: 'Opened new graph', graph }],
      undoIndex: 0,
    }));
    return graph;
  },

  graphRF: initializedGraph,

  setGraphRF: (graphRF) => {
    // If missing uiProps or other fill it here
    if (!graphRF.graph.uiProps) {
      graphRF.graph.uiProps = {};
    }
    set((state) => ({
      ...state,
      graphRF,
    }));
  },

  selectedElement: {} as EwoksRFNode | EwoksRFLink | GraphDetails,

  setSelectedElement: (element, from) => {
    console.log(element);
    const wg = get().workingGraph.graph.id;
    const { graph, nodes, links } = get().graphRF;

    if (wg === '0' || wg === graph.id) {
      let tempGraph = {} as GraphRF;
      if ('position' in element) {
        tempGraph = {
          graph,
          nodes: [...nodes.filter((nod) => nod.id !== element.id), element],
          links,
        };
        if (from === 'fromSaveElement') {
          get().setUndoRedo({
            action: 'Node details changed',
            graph: tempGraph,
          });
          // get().setUndoIndex(get().undoIndex + 1);
        }
      } else if ('source' in element) {
        tempGraph = {
          graph,
          nodes,
          links: [...links.filter((link) => link.id !== element.id), element],
        };
        if (from === 'fromSaveElement') {
          get().setUndoRedo({
            action: 'Link details changed',
            graph: tempGraph,
          });
          // get().setUndoIndex(get().undoIndex + 1);
        }
      } else {
        tempGraph = {
          graph: element,
          nodes,
          links,
        };

        if (from === 'fromSaveElement') {
          get().setUndoRedo({
            action: 'Graph details changed',
            graph: tempGraph,
          });
          // get().setUndoIndex(get().undoIndex + 1);
        }
      }
      set((state) => ({
        ...state,
        graphRF: tempGraph,
        selectedElement: element,
      }));
    } else {
      set((state) => ({
        ...state,
        selectedElement: element,
      }));
    }
  },

  subGraph: {
    graph: { id: '', label: '', input_nodes: [], output_nodes: [] },
    nodes: [],
    links: [],
  } as GraphRF,

  setSubGraph: async (subGraph: GraphEwoks) => {
    // 1. input the graphEwoks from server or file-system
    // 2. search for all subgraphs in it (async)
    const newNodeSubgraphs = await findAllSubgraphs(
      subGraph,
      get().recentGraphs
    );
    // 3. Put the newNodeSubgraphs into recent in their graphRF form (sync)
    newNodeSubgraphs.forEach((gr) => {
      // calculate the rfNodes using the fetched subgraphs
      const rfNodes = toRFEwoksNodes(gr, newNodeSubgraphs, get().tasks);

      get().setRecentGraphs({
        graph: gr.graph,
        nodes: rfNodes,
        links: toRFEwoksLinks(gr, newNodeSubgraphs, get().tasks),
      });
    });
    // 4. Calculate the new graph given the subgraphs
    const grfNodes = toRFEwoksNodes(subGraph, newNodeSubgraphs, get().tasks);

    const graph = {
      graph: subGraph.graph,
      nodes: grfNodes,
      links: toRFEwoksLinks(subGraph, newNodeSubgraphs, get().tasks),
    };
    // Adding a subgraph to an existing workingGraph:
    // save the workingGraph in the recent graphs and add a new graph node to it

    let subToAdd = graph as GraphRF;

    if (get().recentGraphs.length === 0) {
      // if there is no initial graph to drop-in the subgraph -> create one? TODO?
      subToAdd = createGraph();
      get().setSubgraphsStack({
        id: subToAdd.graph.id,
        label: subToAdd.graph.label,
      });
      get().setRecentGraphs(subToAdd);
    } else {
      // TODO: if not in the recentGraphs?
      // subToAdd = get().recentGraphs.find(
      //   (gr) => gr.graph.id === get().graphRF.graph.id
      // );
    }

    let newNode = {} as EwoksRFNode;
    if (subToAdd) {
      const inputsSub = subToAdd.graph.input_nodes.map((input) => {
        return {
          label: `${
            input.uiProps && input.uiProps.label
              ? input.uiProps.label
              : input.id
          }: ${input.node} ${input.sub_node ? `  -> ${input.sub_node}` : ''}`,
          type: 'data ',
        };
      });
      const outputsSub = subToAdd.graph.output_nodes.map((output) => {
        return {
          label: `${
            output.uiProps && output.uiProps.label
              ? output.uiProps.label
              : output.id
          }: ${output.node} ${output.sub_node ? ` -> ${output.sub_node}` : ''}`,
          type: 'data ',
        };
      });
      let id = 0;
      let graphId = subToAdd.graph.label;
      while (get().graphRF.nodes.some((nod) => nod.id === graphId)) {
        graphId += id++;
      }
      newNode = {
        sourcePosition: 'right',
        targetPosition: 'left',
        task_generator: '',
        // TODO: ids should be unique to this graph only as a node for this subgraph
        // human readable but automatically generated?
        id: graphId,
        // TODO: can we upload a task too like a subgraph
        task_type: 'graph',
        task_identifier: subToAdd.graph.id,
        type: 'graph',
        position: { x: 100, y: 500 },
        default_inputs: [],
        inputs_complete: false,
        data: {
          exists: true,
          label: subToAdd.graph.label,
          type: 'internal',
          comment: '',
          // TODO: icon needs to be in the task and graph JSON specification
          icon: subToAdd.graph.uiProps && subToAdd.graph.uiProps.icon,
          inputs: inputsSub,
          outputs: outputsSub,
          // icon: subToAdd.data.icon ? subToAdd.data.icon : '',
        },
        // data: { label: CustomNewNode(id, name, image) },
      };

      get().setRecentGraphs(subToAdd);
    } else {
      // Handle
      get().setOpenSnackbar({
        open: true,
        text: 'Couldnt locate the workingGraph in the recent!',
        severity: 'warning',
      });
    }
    const newWorkingGraph = {
      graph: get().graphRF.graph,
      nodes: [...get().graphRF.nodes, newNode],
      links: get().graphRF.links,
    };
    get().setGraphRF(newWorkingGraph);
    get().setRecentGraphs(newWorkingGraph);
    return graph;
  },
}));
export default useStore;
