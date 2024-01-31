import isEqual from 'lodash/isEqual';
import type { Edge, Node } from 'reactflow';
import { create } from 'zustand';

import type { GraphDetails, LinkData, NodeData, Workflow } from '../types';
import { prepareEwoksGraph } from '../utils';

interface State {
  workflowChanges: (Workflow | undefined)[];
  currentIndex: number;
  setWorkflowChange: (change: workflowChange) => void;
}

export interface workflowChange {
  nodesData: Map<string, NodeData>;
  edgesData: Map<string, LinkData>;
  workflowInfo: GraphDetails;
  rfNodesEdges: { nodes: Node[]; edges: Edge[] };
}

const useWorkflowChanges = create<State>((set, get) => ({
  workflowChanges: [],
  currentIndex: 0,
  setWorkflowChange: (change: workflowChange) => {
    const { nodesData, edgesData, workflowInfo, rfNodesEdges } = change;

    const ewoksWorkflow = prepareEwoksGraph(
      workflowInfo,
      rfNodesEdges.nodes,
      rfNodesEdges.edges,
      nodesData,
      edgesData,
    );

    const workflowStack = get().workflowChanges;
    const index = get().currentIndex;

    const firstWorkflow = workflowStack[0];
    const isNewWorkflow =
      firstWorkflow === undefined ||
      change.workflowInfo.id !== firstWorkflow.graph.id;

    if (isNewWorkflow) {
      set((state) => ({
        ...state,
        currentIndex: 0,
        workflowChanges: [ewoksWorkflow],
      }));
      return;
    }

    const isChanged = !isEqual(workflowStack[index], ewoksWorkflow);

    if (isChanged) {
      set((state) => ({
        ...state,
        currentIndex: get().currentIndex + 1,
        workflowChanges: [...workflowStack, ewoksWorkflow],
      }));
    }
  },
}));

export default useWorkflowChanges;
