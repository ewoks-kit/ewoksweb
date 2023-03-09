import type { GraphDetails, State } from '../types';
import { initializedRFGraph } from '../utils/InitializedEntities';
import type { GetState, SetState } from 'zustand';

export interface GraphRFDetailsSlice {
  graphRFDetails: GraphDetails;
  setGraphRFDetails: (
    graphRFDetails: GraphDetails,
    isChangeToCanvasGraph?: boolean
  ) => void;
}

const graphRFDetails = (
  set: SetState<State>,
  get: GetState<State>
): GraphRFDetailsSlice => ({
  graphRFDetails: initializedRFGraph.graph,

  setGraphRFDetails: (graphRFD, isChangeToCanvasGraph) => {
    // DOC: If missing uiProps or other fill it here
    if (!graphRFD.uiProps) {
      graphRFD.uiProps = {};
    }

    set((state) => ({
      ...state,
      graphRFDetails: graphRFD,
    }));

    if (isChangeToCanvasGraph && !get().inExecutionMode) {
      get().setCanvasGraphChanged(true);
      return;
    }

    if (!isChangeToCanvasGraph) {
      get().setCanvasGraphChanged(false);
    }
  },
});

export default graphRFDetails;
