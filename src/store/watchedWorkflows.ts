import type { Event, State } from '../types';
import type { GetState, SetState } from 'zustand';

// These are the workflows that can be examined on the canvas
// They include executing-live and the watched workflows from server
export interface WatchedWorkflowsSlice {
  watchedWorkflows: Event[][];
  setWatchedWorkflows: (execEvent: Event[][]) => void;
}

const watchedWorkflows = (
  set: SetState<State>,
  get: GetState<State>
): WatchedWorkflowsSlice => ({
  watchedWorkflows: [],

  setWatchedWorkflows: (watchedWorkflowsL) => {
    set((state) => ({
      ...state,
      watchedWorkflowsL,
    }));
    get().setOpenSettingsDrawer('close');
  },
});

export default watchedWorkflows;
