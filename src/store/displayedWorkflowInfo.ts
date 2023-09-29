import type { GraphDetails, State } from '../types';
import { EMPTY_RF_GRAPH } from '../utils/emptyGraphs';
import type { SetState } from 'zustand';
import { merge } from 'lodash';

function getNewHierarchy(
  newWorkflowInfo: GraphDetails,
  oldHierarchy: string[]
) {
  const workflowIndexInHierarchy: number = oldHierarchy.indexOf(
    newWorkflowInfo.id
  );

  if (workflowIndexInHierarchy === -1) {
    return [...oldHierarchy, newWorkflowInfo.id];
  }

  if (workflowIndexInHierarchy === oldHierarchy.length - 1) {
    // TODO: if user insert the same 'graph' and is the first then stack is not updated
    // Not applicable so left as is and it just wont be able to doubleClick
    return oldHierarchy;
  }

  return oldHierarchy.slice(0, workflowIndexInHierarchy + 1);
}

export interface DisplayedWorkflowInfoSlice {
  displayedWorkflowInfo: GraphDetails;
  displayedWorkflowHierarchy: string[];
  setDisplayedWorkflowInfo: (displayedWorkflowInfo: GraphDetails) => void;
  mergeDisplayedWorkflowInfo: (
    displayedWorkflowInfo: Partial<GraphDetails>
  ) => void;
  resetDisplayedWorkflowInfo: () => void;
}

const displayedWorkflowInfo = (
  set: SetState<State>
): DisplayedWorkflowInfoSlice => ({
  displayedWorkflowInfo: EMPTY_RF_GRAPH.graph,
  displayedWorkflowHierarchy: [],

  setDisplayedWorkflowInfo: (newWorkflowInfo) => {
    // DOC: If missing uiProps or other fill it here
    if (!newWorkflowInfo.uiProps) {
      newWorkflowInfo.uiProps = {};
    }

    set((state) => ({
      ...state,
      displayedWorkflowInfo: newWorkflowInfo,
      displayedWorkflowHierarchy: getNewHierarchy(
        newWorkflowInfo,
        state.displayedWorkflowHierarchy
      ),
    }));
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
      displayedWorkflowHierarchy: [],
    }),
});

export default displayedWorkflowInfo;
