import type { WorkflowDescription, State } from '../types';
import type { SetState } from 'zustand';

export interface AllWorkflowsSlice {
  allWorkflows: WorkflowDescription[];
  setAllWorkflows: (workflows: WorkflowDescription[]) => void;
}

const allWorkflows = (set: SetState<State>): AllWorkflowsSlice => ({
  allWorkflows: [],

  setAllWorkflows: (workflows: WorkflowDescription[]) => {
    set((state) => ({
      ...state,
      allWorkflows: workflows,
    }));
  },
});

export default allWorkflows;
