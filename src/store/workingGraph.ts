import type {
  EwoksRFLinkData,
  EwoksRFNode,
  EwoksRFNodeData,
  GraphEwoks,
  GraphRF,
  State,
} from '../types';
import { toRFEwoksNodes } from '../utils/toRFEwoksNodes';
import { toRFEwoksLinks } from '../utils/toRFEwoksLinks';
import { findAllSubgraphs } from './storeUtils/FindAllSubgraphs';
import type { GetState, SetState } from 'zustand';
import { initializedRFGraph } from '../utils/InitializedEntities';
import useNodeDataStore from './useNodeDataStore';
import useEdgeDataStore from './useEdgeDataStore';
import type { ReactFlowInstance } from 'reactflow';
import layoutNewGraph from '../utils/layoutNewGraph';

export interface WorkingGraphSlice {
  workingGraph: GraphRF;
  workingGraphSource: string | undefined;
  setWorkingGraph: (
    workingGraphObject: GraphEwoks,
    rfInstance: ReactFlowInstance,
    source?: string
  ) => Promise<void>;
}

const workingGraph = (
  set: SetState<State>,
  get: GetState<State>
): WorkingGraphSlice => ({
  workingGraph: initializedRFGraph,
  workingGraphSource: undefined,

  setWorkingGraph: async (inputGraph, rfInstance, source): Promise<void> => {
    // 1. Initialize the canvas while working on the new graph
    get().setSubgraphsStack({
      id: '',
      label: '',
      resetStack: true,
    });
    get().resetRecentGraphs();

    // 2. Get node-subgraphs for the graph
    const newNodeSubgraphs = await findAllSubgraphs(
      inputGraph,
      get().recentGraphs
    );

    // 3. Put the newNodeSubgraphs into recent in their graphRF form (sync)
    newNodeSubgraphs.forEach((gr) => {
      // calculate the rfNodes using the fetched subgraphs
      // nodes and edges stored with their data as EwoksRFNodes-Links
      get().addRecentGraph({
        graph: gr.graph,
        nodes: toRFEwoksNodes(gr, newNodeSubgraphs, get().tasks),
        links: toRFEwoksLinks(gr, newNodeSubgraphs, get().tasks),
      });
    });

    // 4. Calculate the new graph given the subgraphs
    let grfNodes = toRFEwoksNodes(inputGraph, newNodeSubgraphs, get().tasks);

    // 5. Calculate notes nodes
    const notes: EwoksRFNode[] =
      inputGraph.graph.uiProps?.notes?.map((note) => {
        return {
          data: {
            ewoks_props: { label: note.label },
            task_props: { task_type: 'note', task_identifier: note.id },
            ui_props: {
              nodeWidth: note.nodeWidth ?? 180,
              colorBorder: note.colorBorder,
            },
            comment: note.comment,
          },
          id: note.id,
          type: 'note',
          position: note.position,
        };
      }) || [];

    grfNodes = [...grfNodes, ...notes];
    const rfLinks = toRFEwoksLinks(inputGraph, newNodeSubgraphs, get().tasks);
    const resultGraph: GraphRF = {
      graph: inputGraph.graph,
      nodes: grfNodes,
      links: rfLinks,
    };
    // DOC: reset RF nodes and edges before setting new nodes/edges data
    // Better solution?
    rfInstance.setNodes([]);
    rfInstance.setEdges([]);

    useNodeDataStore.getState().setNodesData(resultGraph.nodes);
    useEdgeDataStore.getState().setEdgesData(resultGraph.links);

    get().addRecentGraph(resultGraph);

    get().setGraphInfo(resultGraph.graph);

    const newGraphNoData = {
      graph: resultGraph.graph,
      nodes: grfNodes.map((nod) => {
        return { ...nod, data: {} as EwoksRFNodeData };
      }),
      links: rfLinks.map((lin) => {
        return { ...lin, data: {} as EwoksRFLinkData };
      }),
    };
    // add the new graph to the recent graphs if not already there
    get().addRecentGraph({
      graph: inputGraph.graph,
      nodes: grfNodes,
      links: toRFEwoksLinks(inputGraph, newNodeSubgraphs, get().tasks),
    });
    get().setSubgraphsStack({
      id: inputGraph.graph.id,
      label: inputGraph.graph.label,
    });
    set((state) => ({
      ...state,
      workingGraph: newGraphNoData,
      workingGraphSource: source,
    }));

    if (!newGraphNoData.nodes.some((nod) => nod.position.x !== 100)) {
      rfInstance.setNodes(
        await layoutNewGraph(newGraphNoData.nodes, newGraphNoData.links)
      );
      rfInstance.setEdges(newGraphNoData.links);
    } else {
      rfInstance.setNodes(newGraphNoData.nodes);
      rfInstance.setEdges(newGraphNoData.links);
    }
  },
});
export default workingGraph;
