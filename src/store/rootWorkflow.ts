import type { ReactFlowInstance } from 'reactflow';
import type { GetState, SetState } from 'zustand';

import type { NodeWithData, State, Task, Workflow } from '../types';
import { getSubgraphs } from '../utils';
import layoutNewGraph from '../utils/layoutNewGraph';
import { toRFEwoksLinks } from '../utils/toRFEwoksLinks';
import { toRFEwoksNodes } from '../utils/toRFEwoksNodes';
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

    // 2. Get node-subgraphs for the graph
    const newNodeSubgraphs = await getSubgraphs(ewoksWorkflow);

    // 3. Calculate the new graph given the subgraphs
    let grfNodes = toRFEwoksNodes(ewoksWorkflow, newNodeSubgraphs, tasks);

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

    grfNodes = [...grfNodes, ...notes];

    const rfLinks = toRFEwoksLinks(ewoksWorkflow, newNodeSubgraphs, tasks);

    if (grfNodes.length > 0) {
      useNodeDataStore.getState().setDataFromNodes(grfNodes);
      useEdgeDataStore.getState().setDataFromEdges(rfLinks);
    }

    get().setDisplayedWorkflowInfo(ewoksWorkflow.graph);

    set((state) => ({
      ...state,
      rootWorkflowId: ewoksWorkflow.graph.id,
      rootWorkflowSource: source,
    }));

    const nodesWithoutData = grfNodes.map((node) => {
      return { ...node, data: {} };
    });
    const edgesWithoutData = rfLinks.map((edge) => {
      return { ...edge, data: {} };
    });

    if (!grfNodes.some((nod) => nod.position.x !== 100)) {
      rfInstance.setNodes(
        await layoutNewGraph(nodesWithoutData, edgesWithoutData),
      );
      rfInstance.setEdges(rfLinks);
    } else {
      rfInstance.setNodes(nodesWithoutData);
      rfInstance.setEdges(edgesWithoutData);
      get().setWorkflowIsChanged(false);
    }
  },
});
export default rootWorkflow;
