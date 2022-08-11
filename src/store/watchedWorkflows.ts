import type { ExecutedJobsResponse, Event } from '../types';

// These are the workflows that can be examined on the canvas
// They include executing-live and the selected workflows from the executed table

const watchedWorkflows = (set, get) => ({
  watchedWorkflows: [] as Event[][],

  setWatchedWorkflows: async (watchedWorkflows: Event[][], live: boolean) => {
    console.log(watchedWorkflows);
    // Add all events to keep track of the order they came in
    const prevState = get((prev) => prev);

    // calculate the id of the event based on the order of arrival
    // const workflow = {
    //   ...watchedWorkflow,
    //   id: (prevState.executedEvents.length as number) + 1,
    // };
    // send it to executing events to addapt
    // prevState.setExecutingWorkflows(workflow, true);
    set((state) => ({
      ...state,
      watchedWorkflows: watchedWorkflows,
    }));
  },
});

export default watchedWorkflows;
