import type { ReactFlowInstance } from 'reactflow';
import type { GetState, SetState } from 'zustand';

import type {
  Graph,
  LinkData,
  NodeData,
  RFNode,
  State,
  Task,
  Workflow,
} from '../types';
import layoutNewGraph from '../utils/layoutNewGraph';
import { toRFEwoksLinks } from '../utils/toRFEwoksLinks';
import { toRFEwoksNodes } from '../utils/toRFEwoksNodes';
import { findAllSubgraphs } from './storeUtils/FindAllSubgraphs';
import { validateWorkflow } from './storeUtils/validateWorkflow';
import useEdgeDataStore from './useEdgeDataStore';
import useNodeDataStore from './useNodeDataStore';
import useSnackbarStore from './useSnackbarStore';

export interface RootWorkflowSlice {
  rootWorkflowId: string;
  rootWorkflowSource: string | undefined;
  setRootWorkflow: (
    ewoksWorkflow: Workflow,
    rfInstance: ReactFlowInstance,
    tasks: Task[],
    source?: string,
  ) => Promise<void>;
}

const rootWorkflow = (
  set: SetState<State>,
  get: GetState<State>,
): RootWorkflowSlice => ({
  rootWorkflowId: '',
  rootWorkflowSource: undefined,

  setRootWorkflow: async (
    ewoksWorkflow,
    rfInstance,
    tasks,
    source,
  ): Promise<void> => {
    const { showErrorMsg } = useSnackbarStore.getState();

    const validWorkflow = validateWorkflow(ewoksWorkflow);

    if (!validWorkflow.valid) {
      showErrorMsg(
        `Error in workflow JSON description: ${
          validWorkflow.invalidReason || ''
        }`,
      );
      return;
    }

    // 1. Initialize the canvas while working on the new graph
    get().resetDisplayedWorkflowInfo();
    get().resetLoadedGraphs();

    // 2. Get node-subgraphs for the graph
    const newNodeSubgraphs = await findAllSubgraphs(ewoksWorkflow, [
      ...get().loadedGraphs.values(),
    ]);

    // 3. Put the newNodeSubgraphs into loadedGraphs in their Graph form (sync)
    newNodeSubgraphs.forEach((gr) => {
      // calculate the RFNodes using the fetched subgraphs
      // nodes and edges stored with their data as EwoksRFNodes-Links
      get().addLoadedGraph({
        graph: gr.graph,
        nodes: toRFEwoksNodes(gr, newNodeSubgraphs, tasks),
        links: toRFEwoksLinks(gr, newNodeSubgraphs, tasks),
      });
    });

    // 4. Calculate the new graph given the subgraphs
    let grfNodes = toRFEwoksNodes(ewoksWorkflow, newNodeSubgraphs, tasks);

    const notes: RFNode[] =
      ewoksWorkflow.graph.uiProps?.notes?.map((note) => {
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

    const rfLinks = toRFEwoksLinks(ewoksWorkflow, newNodeSubgraphs, tasks);
    const resultGraph: Graph = {
      graph: ewoksWorkflow.graph,
      nodes: grfNodes,
      links: rfLinks,
    };
    get().addLoadedGraph(resultGraph);

    if (resultGraph.nodes.length > 0) {
      useNodeDataStore.getState().setDataFromNodes(resultGraph.nodes);
      useEdgeDataStore.getState().setDataFromEdges(resultGraph.links);
    }

    get().setDisplayedWorkflowInfo(resultGraph.graph);

    const newGraphNoData = {
      graph: resultGraph.graph,
      nodes: grfNodes.map((nod) => {
        return { ...nod, data: {} as NodeData };
      }),
      links: rfLinks.map((lin) => {
        return { ...lin, data: {} as LinkData };
      }),
    };

    set((state) => ({
      ...state,
      rootWorkflowId: newGraphNoData.graph.id,
      rootWorkflowSource: source,
    }));

    if (!newGraphNoData.nodes.some((nod) => nod.position.x !== 100)) {
      rfInstance.setNodes(
        await layoutNewGraph(newGraphNoData.nodes, newGraphNoData.links),
      );
      rfInstance.setEdges(newGraphNoData.links);
    } else {
      rfInstance.setNodes(newGraphNoData.nodes);
      rfInstance.setEdges(newGraphNoData.links);
    }
  },
});
export default rootWorkflow;
