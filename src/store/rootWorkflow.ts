import type { ReactFlowInstance } from 'reactflow';
import type { Node } from 'reactflow';
import type { GetState, SetState } from 'zustand';

import type {
  Graph,
  Link,
  NodeWithData,
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
      // nodes and edges stored with their data as RFNodes-Links
      get().addLoadedGraph({
        graph: gr.graph,
        nodes: toRFEwoksNodes(gr, newNodeSubgraphs, tasks),
        links: toRFEwoksLinks(gr, newNodeSubgraphs, tasks),
      });
    });

    // 4. Calculate the new graph given the subgraphs
    let nodesWithData = toRFEwoksNodes(ewoksWorkflow, newNodeSubgraphs, tasks);

    const notes: NodeWithData[] =
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

    nodesWithData = [...nodesWithData, ...notes];

    const linksWithData = toRFEwoksLinks(
      ewoksWorkflow,
      newNodeSubgraphs,
      tasks,
    );

    // Calculate resultGraph only for adding it to loadedGraphs
    const resultGraph: Graph = {
      graph: ewoksWorkflow.graph,
      nodes: nodesWithData,
      links: linksWithData,
    };
    get().addLoadedGraph(resultGraph);

    const nodes: RFNode[] = nodesWithData.map((nod) => {
      const { data, ...nodeNoData } = nod;
      return nodeNoData;
    });

    const links: Link[] = linksWithData.map((lin) => {
      const { data, ...linkNoData } = lin;
      return linkNoData;
    });

    if (resultGraph.nodes.length > 0) {
      useNodeDataStore.getState().setDataFromNodes(resultGraph.nodes);
      useEdgeDataStore.getState().setDataFromEdges(resultGraph.links);
    }

    get().setDisplayedWorkflowInfo(ewoksWorkflow.graph);

    set((state) => ({
      ...state,
      rootWorkflowId: ewoksWorkflow.graph.id,
      rootWorkflowSource: source,
    }));

    if (!nodes.some((nod) => nod.position.x !== 100)) {
      rfInstance.setNodes((await layoutNewGraph(nodes, links)) as Node[]);
      rfInstance.setEdges(links);
    } else {
      rfInstance.setNodes(nodes as Node[]);
      rfInstance.setEdges(links);
    }
  },
});
export default rootWorkflow;
