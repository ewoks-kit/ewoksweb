import type { Event, State } from '../types';
import type { SetState } from 'zustand';

export interface ExecutedWorkflowsSlice {
  executedWorkflows: Event[][];
  setExecutedWorkflows: (execEvent: Event[][], live?: boolean) => void;
}

const executedWorkflows = (set: SetState<State>): ExecutedWorkflowsSlice => ({
  executedWorkflows: [],

  setExecutedWorkflows: (execWorkflow: Event[][]) => {
    set((state) => ({
      ...state,
      executedWorkflows: execWorkflow,
    }));
  },
});

export default executedWorkflows;
