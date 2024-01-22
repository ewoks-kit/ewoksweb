import type { Edge, Node } from 'reactflow';
import { create } from 'zustand';

import type { GraphDetails, LinkData, NodeData } from '../types';

interface State {
  workflowChanges: workflowChange[];
  currentIndex: number;
  setWorkflowChange: (change: object) => void;
}

interface workflowChange {
  nodesData?: NodeData[];
  edgesData?: LinkData[];
  workflowInfo?: GraphDetails;
  rfNodesEdges?: { nodes: Node[]; edges: Edge[] };
}

const useWorkflowChanges = create<State>((set) => ({
  // the first input will be the one to compare with === initialGraph
  workflowChanges: [],
  currentIndex: 0,
  setWorkflowChange: (change) => {
    console.log(change);
    // calculate the new graph to update the state
    // receive changes seperately for nodesData, edgesData, workflowInfo, rfNodes-Edges
    // to break comparing to only the changed part the workflow changes must have this
    // structure with 4 objects
    if (change.is === 'applicable') {
      set((state) => ({
        ...state,
      }));
    }
  },
}));

export default useWorkflowChanges;
