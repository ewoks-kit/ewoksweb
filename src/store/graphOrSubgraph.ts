import type { SetState } from 'zustand';
import type { State } from '../types';

export interface GraphOrSubgraphSlice {
  graphOrSubgraph?: boolean;
  setGraphOrSubgraph?: (isItGraph: boolean) => void;
}

const graphOrSubgraph = (set: SetState<State>): GraphOrSubgraphSlice => ({
  graphOrSubgraph: true as boolean,

  setGraphOrSubgraph: (isItGraph: boolean) => {
    set((state) => ({
      ...state,
      graphOrSubgraph: isItGraph,
    }));
  },
});

export default graphOrSubgraph;
