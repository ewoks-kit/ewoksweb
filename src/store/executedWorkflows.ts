import type { Event, State } from '../types';
import type { SetState } from 'zustand';

export interface ExecutedWorkflowsSlice {
  executedWorkflows: Event[][];
  setExecutedWorkflows: (execEvent: Event[][], live?: boolean) => void;
}

// GET /execution/events gets events with filters for nodes, workflows etc
// use this to fetch events for a workflow, a job etc

// TODO: It would help to have a intermediate type:
// type Workflow = Event[] so that executedWorkflows have the type Workflow[]
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
