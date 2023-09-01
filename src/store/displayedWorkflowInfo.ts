import type { GraphDetails, State } from '../types';
import { EMPTY_RF_GRAPH } from '../utils/emptyGraphs';
import type { SetState } from 'zustand';
import { merge } from 'lodash';

export interface DisplayedWorkflowInfoSlice {
  displayedWorkflowInfo: GraphDetails;
  setDisplayedWorkflowInfo: (displayedWorkflowInfo: GraphDetails) => void;
  mergeDisplayedWorkflowInfo: (
    displayedWorkflowInfo: Partial<GraphDetails>
  ) => void;
}

const displayedWorkflowInfo = (
  set: SetState<State>
): DisplayedWorkflowInfoSlice => ({
  displayedWorkflowInfo: EMPTY_RF_GRAPH.graph,

  setDisplayedWorkflowInfo: (graphRFD) => {
    // DOC: If missing uiProps or other fill it here
    if (!graphRFD.uiProps) {
      graphRFD.uiProps = {};
    }

    set((state) => ({
      ...state,
      displayedWorkflowInfo: graphRFD,
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
});

export default displayedWorkflowInfo;
