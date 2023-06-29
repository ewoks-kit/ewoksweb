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
    // DOC: If missing uiProps or other fill it here
    if (!graphRFL.graph.uiProps) {
      graphRFL.graph.uiProps = {};
    }

    set((state) => ({
      ...state,
      graphRF: graphRFL,
    }));

    if (isChangeToCanvasGraph) {
      get().setCanvasGraphChanged(true);
      return;
    }

    get().setCanvasGraphChanged(false);
  },
});

export default graphRF;
