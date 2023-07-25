import type { GraphDetails, State } from '../types';
import { initializedRFGraph } from '../utils/InitializedEntities';
import type { SetState } from 'zustand';
import { merge } from 'lodash';

export interface GraphInfoSlice {
  graphInfo: GraphDetails;
  setGraphInfo: (graphInfo: GraphDetails) => void;
  mergeGraphInfo: (graphInfo: Partial<GraphDetails>) => void;
}

const graphInfo = (set: SetState<State>): GraphInfoSlice => ({
  graphInfo: initializedRFGraph.graph,

  setGraphInfo: (graphRFD) => {
    // DOC: If missing uiProps or other fill it here
    if (!graphRFD.uiProps) {
      graphRFD.uiProps = {};
    }

    set((state) => ({
      ...state,
      graphInfo: graphRFD,
    }));
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
