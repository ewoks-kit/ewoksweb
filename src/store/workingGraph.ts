import type {
  EwoksRFLink,
  EwoksRFNode,
  GraphEwoks,
  GraphRF,
  State,
  Task,
} from '../types';
import { toRFEwoksNodes } from '../utils/toRFEwoksNodes';
import { toRFEwoksLinks } from '../utils/toRFEwoksLinks';
import { findAllSubgraphs } from './storeUtils/FindAllSubgraphs';
import commonStrings from '../commonStrings.json';
import { getTaskDescription } from '../api/api';
import type { GetState, SetState } from 'zustand';
import { initializedRFGraph } from '../utils/InitializedEntities';
import { textForError } from '../utils';

export interface WorkingGraphSlice {
  workingGraph: GraphRF;
  setWorkingGraph: (
    workingGraphObject: GraphEwoks,
    source?: string
  ) => Promise<GraphRF>;
}

const workingGraph = (
  set: SetState<State>,
  get: GetState<State>
): WorkingGraphSlice => ({
  workingGraph: initializedRFGraph,

  setWorkingGraph: async (workingGraphObject, source): Promise<GraphRF> => {
    // 1. if it is a new graph opening initialize
    if (get().tasks.length === 0) {
      try {
        const tasksData = await getTaskDescription();
        const tasks = tasksData.data as { items: Task[] };
        get().setTasks(tasks.items);
      } catch (error) {
        get().setOpenSnackbar({
          open: true,
          text: textForError(error, commonStrings.retrieveTasksError),
          severity: 'error',
        });
      }
    }
    get().setSelectedElement({} as EwoksRFNode | EwoksRFLink);
    get().setSubgraphsStack({ id: '', label: '', resetStack: true });
    get().resetRecentGraphs();

    // 2. Get node-subgraphs for the graph
    const newNodeSubgraphs = await findAllSubgraphs(
      workingGraphObject,
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
    let grfNodes = toRFEwoksNodes(
      workingGraphObject,
      newNodeSubgraphs,
      get().tasks
    );

    // 5. Calculate notes nodes
    const notes: EwoksRFNode[] =
      workingGraphObject.graph?.uiProps?.notes?.map((note) => {
        return {
          data: {
            ewoks_props: { label: note.label },
            task_props: { task_type: 'note', task_identifier: note.id },
            ui_props: { nodeWidth: note.nodeWidth ?? 180 },
            comment: note.comment,
          },
          id: note.id,
          type: 'note',
          position: note.position,
        };
      }) || [];

    grfNodes = [...grfNodes, ...notes];

    const graph = {
      graph: {
        ...workingGraphObject.graph,
        uiProps: { ...workingGraphObject.graph.uiProps, source },
      },
      nodes: grfNodes,
      links: toRFEwoksLinks(workingGraphObject, newNodeSubgraphs, get().tasks),
    };

    get().setRecentGraphs(graph as GraphRF);

    // TBD keep in parallel with GraphRF until removed completelly
    get().setGraphRF(graph as GraphRF);
    get().setGraphRFDetails(graph.graph);

    get().setSelectedElement(graph.graph);
    // add the new graph to the recent graphs if not already there
    get().setRecentGraphs({
      graph: workingGraphObject.graph,
      nodes: grfNodes,
      links: toRFEwoksLinks(workingGraphObject, newNodeSubgraphs, get().tasks),
    });
    get().setSubgraphsStack({
      id: workingGraphObject.graph.id,
      label: workingGraphObject.graph.label,
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
