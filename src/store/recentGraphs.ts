import type { GraphRF, State } from '../types';
import type { GetState, SetState } from 'zustand';

export interface RecentGraphsSlice {
  recentGraphs: GraphRF[];
  addRecentGraph: (newGraph: GraphRF) => void;
  resetRecentGraphs: () => void;
}

const recentGraphs = (
  set: SetState<State>,
  get: GetState<State>
): RecentGraphsSlice => ({
  recentGraphs: [],

  addRecentGraph: (newGraph) => {
    const rec: GraphRF[] = get().recentGraphs.filter(
      (gr) => gr.graph.id !== newGraph.graph.id
    );

    set((state) => ({
      ...state,
      recentGraphs: [...rec, newGraph],
    }));
  },

  resetRecentGraphs: () => {
    set((state) => ({
      ...state,
      recentGraphs: [],
    }));
  },
});

export default recentGraphs;
