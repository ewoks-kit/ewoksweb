import type { Event } from '../types';

// GET /execution/events gets events with filters for nodes, workflows etc
// use this to fetch events for a workflow, a job etc
//
const executedWorkflows = (set, get) => ({
  executedWorkflows: [] as Event[][],

  setExecutedWorkflows: async (execWorkflow: Event[][], live: boolean) => {
    console.log(execWorkflow);
    // Add all events to keep track of the order they came in
    const prevState = get((prev) => prev);

    // calculate the id of the event based on the order of arrival
    const workflow = {
      ...execWorkflow,
      id: (prevState.executedEvents.length as number) + 1,
    };
    // send it to executing events to addapt
    // prevState.setExecutingWorkflows(workflow, true);
    set((state) => ({
      ...state,
      executedWorkflows: execWorkflow,
    }));
  },
});

export default executedWorkflows;
