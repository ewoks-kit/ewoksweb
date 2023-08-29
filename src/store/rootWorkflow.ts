import type {
  EwoksRFLinkData,
  EwoksRFNode,
  EwoksRFNodeData,
  GraphEwoks,
  GraphRF,
  State,
  Task,
} from '../types';
import { toRFEwoksNodes } from '../utils/toRFEwoksNodes';
import { toRFEwoksLinks } from '../utils/toRFEwoksLinks';
import { findAllSubgraphs } from './storeUtils/FindAllSubgraphs';
import type { GetState, SetState } from 'zustand';
// import { EMPTY_RF_GRAPH } from '../utils/emptyGraphs';
import useNodeDataStore from './useNodeDataStore';
import useEdgeDataStore from './useEdgeDataStore';
import type { ReactFlowInstance } from 'reactflow';
import layoutNewGraph from '../utils/layoutNewGraph';

export interface RootWorkflowSlice {
  rootWorkflowId: string;
  // Also change the following to rootWorkflowSource?
  rootWorkflowSource: string | undefined;
  setRootWorkflow: (
    rootWorkflowObject: GraphEwoks,
    rfInstance: ReactFlowInstance,
    tasks: Task[],
    source?: string
  ) => Promise<void>;
}

const rootWorkflow = (
  set: SetState<State>,
  get: GetState<State>
): RootWorkflowSlice => ({
  rootWorkflowId: '',
  rootWorkflowSource: undefined,

  setRootWorkflow: async (
    inputGraph,
    rfInstance,
    tasks,
    source
  ): Promise<void> => {
    // 1. Initialize the canvas while working on the new graph
    get().setSubgraphsStack({
      id: '',
      label: '',
      resetStack: true,
    });
    get().resetRFWorkflows();

    // 2. Get node-subgraphs for the graph
    const newNodeSubgraphs = await findAllSubgraphs(inputGraph, [
      ...get().rfWorkflows.values(),
    ]);

    // 3. Put the newNodeSubgraphs into recent in their graphRF form (sync)
    newNodeSubgraphs.forEach((gr) => {
      // calculate the rfNodes using the fetched subgraphs
      // nodes and edges stored with their data as EwoksRFNodes-Links
      get().addRFWorkflow({
        graph: gr.graph,
        nodes: toRFEwoksNodes(gr, newNodeSubgraphs, tasks),
        links: toRFEwoksLinks(gr, newNodeSubgraphs, tasks),
      });
    });

    // 4. Calculate the new graph given the subgraphs
    let grfNodes = toRFEwoksNodes(inputGraph, newNodeSubgraphs, tasks);

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
    const rfLinks = toRFEwoksLinks(inputGraph, newNodeSubgraphs, tasks);
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

    get().addRFWorkflow(resultGraph);

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
    get().addRFWorkflow({
      graph: inputGraph.graph,
      nodes: grfNodes,
      links: toRFEwoksLinks(inputGraph, newNodeSubgraphs, tasks),
    });
    get().setSubgraphsStack({
      id: inputGraph.graph.id,
      label: inputGraph.graph.label,
    });
    set((state) => ({
      ...state,
      rootWorkflowId: newGraphNoData.graph.id,
      rootWorkflowSource: source,
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
export default rootWorkflow;
