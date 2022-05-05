import type { EwoksRFLink, EwoksRFNode, GraphRF, Task } from '../types';
import axios from 'axios';
import { toRFEwoksNodes } from '../utils/toRFEwoksNodes';
import { toRFEwoksLinks } from '../utils/toRFEwoksLinks';
import { findAllSubgraphs } from '../utils/FindAllSubgraphs';
import configData from '../configData.json';

const initializedGraph = {
  graph: {
    id: 'newGraph',
    label: 'newGraph',
    input_nodes: [],
    output_nodes: [],
    uiProps: {},
  },
  nodes: [],
  links: [],
} as GraphRF;

const workingGraph = (set, get) => ({
  workingGraph: initializedGraph,

  setWorkingGraph: async (workingGraph: GraphRF): Promise<GraphRF> => {
    // 1. if it is a new graph opening initialize
    // TODO: remove initialise or id: 0. Send clear messages
    if (get().tasks.length === 0) {
      try {
        const tasksData = await axios.get(
          `${configData.serverUrl}/tasks/descriptions`
        );
        const tasks = tasksData.data as { items: Task[] };
        get().setTasks(tasks.items);
      } catch (error) {
        // console.error('The Promise is rejected!', error);
        get().setOpenSnackbar({
          open: true,
          text: error.response?.data?.message || configData.retrieveTasksError,
          severity: 'error',
        });
      }
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
    // console.log(grfNodes, workingGraph);
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
    // console.log(notes, grfNodes);

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
});
export default workingGraph;
