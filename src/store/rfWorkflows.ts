import type { GraphRF, State } from '../types';
import type { GetState, SetState } from 'zustand';

export interface RfWorkflowsSlice {
  rfWorkflows: Map<string, GraphRF>;
  addRFWorkflow: (newGraph: GraphRF) => void;
  resetRFWorkflows: () => void;
}

const rfWorkflows = (
  set: SetState<State>,
  get: GetState<State>
): RfWorkflowsSlice => ({
  rfWorkflows: new Map(),

  addRFWorkflow: (newGraph) => {
    set((state) => ({
      ...state,
      rfWorkflows: get().rfWorkflows.set(newGraph.graph.id, newGraph),
    }));
  },

  resetRFWorkflows: () => {
    set((state) => ({
      ...state,
      rfWorkflows: new Map(),
    }));
  },
});

export default rfWorkflows;
