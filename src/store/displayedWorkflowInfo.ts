import { merge } from 'lodash';
import type { SetState } from 'zustand';

import type { GraphDetails, State } from '../types';
import { EMPTY_RF_GRAPH } from '../utils/emptyGraphs';

export interface DisplayedWorkflowInfoSlice {
  displayedWorkflowInfo: GraphDetails;
  setDisplayedWorkflowInfo: (displayedWorkflowInfo: GraphDetails) => void;
  mergeDisplayedWorkflowInfo: (
    displayedWorkflowInfo: Partial<GraphDetails>,
  ) => void;
  resetDisplayedWorkflowInfo: () => void;
}

const displayedWorkflowInfo = (
  set: SetState<State>,
): DisplayedWorkflowInfoSlice => ({
  displayedWorkflowInfo: EMPTY_RF_GRAPH.graph,

  setDisplayedWorkflowInfo: (nextWorkflowInfo) => {
    set((prev) => {
      const prevWorkflowId = prev.displayedWorkflowInfo.id;
      if (nextWorkflowInfo.id === prevWorkflowId) {
        return prev;
      }

      return {
        displayedWorkflowInfo: nextWorkflowInfo,
      };
    });
  },

  mergeDisplayedWorkflowInfo: (graphRFD) => {
    set((state) => {
      return {
        ...state,
        displayedWorkflowInfo: merge({}, state.displayedWorkflowInfo, graphRFD),
      };
    });
  },
  resetDisplayedWorkflowInfo: () =>
    set({
      displayedWorkflowInfo: EMPTY_RF_GRAPH.graph,
    }),
});

export default displayedWorkflowInfo;
