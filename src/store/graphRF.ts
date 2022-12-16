import type { GraphRF, State } from '../types';
import { initializedRFGraph } from '../utils/InitializedEntities';
import type { GetState, SetState } from 'zustand';

export interface GraphRFSlice {
  graphRF: GraphRF;
  setGraphRF: (graphRF: GraphRF, isChangeToCanvasGraph?: boolean) => void;
}

const graphRF = (set: SetState<State>, get: GetState<State>): GraphRFSlice => ({
  graphRF: initializedRFGraph,

  setGraphRF: (graphRFL, isChangeToCanvasGraph) => {
    // If missing uiProps or other fill it here
    if (!graphRFL.graph.uiProps) {
      graphRFL.graph.uiProps = {};
    }

    set((state) => ({
      ...state,
      graphRF: graphRFL,
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

export default graphRF;
