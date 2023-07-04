import type { GraphDetails, State } from '../types';
import { initializedRFGraph } from '../utils/InitializedEntities';
import type { GetState, SetState } from 'zustand';
import { merge } from 'lodash';

export interface GraphInfoSlice {
  graphInfo: GraphDetails;
  setGraphInfo: (
    graphInfo: GraphDetails,
    isChangeToCanvasGraph?: boolean
  ) => void;
  mergeGraphInfo: (graphInfo: Partial<GraphDetails>) => void;
}

const graphInfo = (
  set: SetState<State>,
  get: GetState<State>
): GraphInfoSlice => ({
  graphInfo: initializedRFGraph.graph,

  setGraphInfo: (graphRFD, isChangeToCanvasGraph) => {
    // DOC: If missing uiProps or other fill it here
    if (!graphRFD.uiProps) {
      graphRFD.uiProps = {};
    }

    set((state) => ({
      ...state,
      graphInfo: graphRFD,
    }));

    if (isChangeToCanvasGraph) {
      get().setCanvasGraphChanged(true);
      return;
    }

    get().setCanvasGraphChanged(false);
  },
  mergeGraphInfo: (graphRFD) => {
    set((state) => {
      return {
        ...state,
        graphInfo: merge({}, state.graphInfo, graphRFD),
      };
    });
  },
});

export default graphInfo;
