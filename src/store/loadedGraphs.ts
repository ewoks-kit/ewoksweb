import type { GraphRF, State } from '../types';
import type { SetState } from 'zustand';

export interface LoadedGraphsSlice {
  loadedGraphs: Map<string, GraphRF>;
  addLoadedGraph: (newGraph: GraphRF) => void;
  resetLoadedGraphs: () => void;
}

const loadedGraphs = (set: SetState<State>): LoadedGraphsSlice => ({
  loadedGraphs: new Map(),

  addLoadedGraph: (newGraph) => {
    set((state) => ({
      ...state,
      loadedGraphs: new Map(state.loadedGraphs).set(
        newGraph.graph.id,
        newGraph
      ),
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
