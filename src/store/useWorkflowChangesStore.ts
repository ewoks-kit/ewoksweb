import IsEqual from 'lodash';
import type { Edge, Node } from 'reactflow';
import { create } from 'zustand';

import type { GraphDetails, LinkData, NodeData, Workflow } from '../types';
import { prepareEwoksGraph } from '../utils';

interface State {
  workflowChanges: Workflow[];
  currentIndex: number;
  setWorkflowChange: (change: object) => void;
}

export interface workflowChange {
  nodesData?: Map<string, NodeData>;
  edgesData?: Map<string, LinkData>;
  workflowInfo?: GraphDetails;
  rfNodesEdges?: { nodes: Node[]; edges: Edge[] };
}

const useWorkflowChanges = create<State>((set, get) => ({
  // the first input will be the one to compare with === initialGraph
  workflowChanges: [],
  currentIndex: 0,
  setWorkflowChange: (change: workflowChange) => {
    console.log(change);
    const { nodesData, edgesData, workflowInfo, rfNodesEdges } = change;

    const ewoksWorkflow = prepareEwoksGraph(
      workflowInfo || { id: '' },
      rfNodesEdges?.nodes || [],
      rfNodesEdges?.edges || [],
      nodesData || new Map(),
      edgesData || new Map(),
    );
    console.log(ewoksWorkflow, get().workflowChanges);

    // if (change.is === 'applicable') {
    set((state) => ({
      ...state,
      workflowChanges: [...get().workflowChanges, ewoksWorkflow],
    }));
    // }
  },
}));

export default useWorkflowChanges;
