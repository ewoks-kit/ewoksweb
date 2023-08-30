import type { GraphRF, State } from '../types';
import type { GetState, SetState } from 'zustand';

export interface LoadedGraphsSlice {
  loadedGraphs: Map<string, GraphRF>;
  addLoadedGraph: (newGraph: GraphRF) => void;
  resetLoadedGraphs: () => void;
}

const loadedGraphs = (
  set: SetState<State>,
  get: GetState<State>
): LoadedGraphsSlice => ({
  loadedGraphs: new Map(),

  addLoadedGraph: (newGraph) => {
    set((state) => ({
      ...state,
      loadedGraphs: get().loadedGraphs.set(newGraph.graph.id, newGraph),
    }));
  },

  resetLoadedGraphs: () => {
    set((state) => ({
      ...state,
      loadedGraphs: new Map(),
    }));
  },
});

export default loadedGraphs;
