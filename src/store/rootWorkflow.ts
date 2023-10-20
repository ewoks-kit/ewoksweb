import type { ReactFlowInstance } from 'reactflow';
import type { GetState, SetState } from 'zustand';

import type {
  LinkData,
  NodeData,
  RFNode,
  State,
  Task,
  Workflow,
} from '../types';
import { getSubgraphs } from '../utils';
import layoutNewGraph from '../utils/layoutNewGraph';
import { toRFEwoksLinks } from '../utils/toRFEwoksLinks';
import { toRFEwoksNodes } from '../utils/toRFEwoksNodes';
import useEdgeDataStore from './useEdgeDataStore';
import useNodeDataStore from './useNodeDataStore';

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
    // 1. Initialize the canvas while working on the new graph
    get().resetDisplayedWorkflowInfo();

    // 2. Get node-subgraphs for the graph
    const newNodeSubgraphs = await getSubgraphs(ewoksWorkflow);

    // 3. Calculate the new graph given the subgraphs
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

    useNodeDataStore.getState().setDataFromNodes(grfNodes);
    useEdgeDataStore.getState().setDataFromEdges(rfLinks);

    get().setDisplayedWorkflowInfo(ewoksWorkflow.graph);

    const newGraphNoData = {
      graph: ewoksWorkflow.graph,
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
