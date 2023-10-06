import { merge } from 'lodash';
import type { SetState } from 'zustand';

import type { GraphDetails, State } from '../types';
import { EMPTY_RF_GRAPH } from '../utils/emptyGraphs';

function getParentsOfNextWorkflow(
  nextWorkflowId: string,
  prevWorkflowId: string,
  prevParents: string[],
) {
  if (prevWorkflowId === '') {
    return prevParents;
  }

  if (prevParents.includes(nextWorkflowId)) {
    const nextWorkflowIndex = prevParents.indexOf(nextWorkflowId);
    return prevParents.slice(0, nextWorkflowIndex);
  }

  return [...prevParents, prevWorkflowId];
}

export interface DisplayedWorkflowInfoSlice {
  displayedWorkflowInfo: GraphDetails;
  displayedWorkflowParents: string[];
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
  displayedWorkflowParents: [],

  setDisplayedWorkflowInfo: (nextWorkflowInfo) => {
    set((prev) => {
      const prevWorkflowId = prev.displayedWorkflowInfo.id;
      if (nextWorkflowInfo.id === prevWorkflowId) {
        return prev;
      }

      return {
        displayedWorkflowInfo: nextWorkflowInfo,
        displayedWorkflowParents: getParentsOfNextWorkflow(
          nextWorkflowInfo.id,
          prevWorkflowId,
          prev.displayedWorkflowParents,
        ),
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
      displayedWorkflowParents: [],
    }),
});

export default displayedWorkflowInfo;
