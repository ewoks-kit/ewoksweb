import type { Event } from '../types';

// These are the workflows that can be examined on the canvas
// They include executing-live and the watched workflows from server

const watchedWorkflows = (set, get) => ({
  watchedWorkflows: [] as Event[][],

  setWatchedWorkflows: async (watchedWorkflowsL: Event[][]) => {
    set((state) => ({
      ...state,
      watchedWorkflowsL,
    }));
    get().setOpenSettingsDrawer('close');
  },
});

export default watchedWorkflows;
