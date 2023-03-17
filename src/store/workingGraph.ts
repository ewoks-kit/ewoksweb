import type { EwoksRFNode, GraphEwoks, GraphRF, State } from '../types';
import { toRFEwoksNodes } from '../utils/toRFEwoksNodes';
import { toRFEwoksLinks } from '../utils/toRFEwoksLinks';
import { findAllSubgraphs } from './storeUtils/FindAllSubgraphs';
import type { GetState, SetState } from 'zustand';
import { initializedRFGraph } from '../utils/InitializedEntities';
import useSelectedElementStore from './useSelectedElementStore';

export interface WorkingGraphSlice {
  workingGraph: GraphRF;
  initGraph: (
    workingGraphObject: GraphEwoks,
    source?: string
  ) => Promise<GraphRF>;
}

const workingGraph = (
  set: SetState<State>,
  get: GetState<State>
): WorkingGraphSlice => ({
  workingGraph: initializedRFGraph,

  initGraph: async (workingGraphObject, source): Promise<GraphRF> => {
    // 1. Initialize the canvas while working on the new graph
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
      get().addRecentGraph({
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

    get().addRecentGraph(graph as GraphRF);

    get().setGraphInfo(graph.graph);

    useSelectedElementStore
      .getState()
      .setSelectedElement({ type: 'graph', id: graph.graph.id });

    // add the new graph to the recent graphs if not already there
    get().addRecentGraph({
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
