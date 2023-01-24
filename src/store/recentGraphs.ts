import type { GraphRF, State } from '../types';
import type { GetState, SetState } from 'zustand';

export interface RecentGraphsSlice {
  recentGraphs: GraphRF[];
  setRecentGraphs: (newGraph: GraphRF) => void;
  resetRecentGraphs: () => void;
}

const recentGraphs = (
  set: SetState<State>,
  get: GetState<State>
): RecentGraphsSlice => ({
  recentGraphs: [],

  setRecentGraphs: (newGraph) => {
    const rec: GraphRF[] = get().recentGraphs.filter(
      (gr) => gr.graph.id !== newGraph.graph.id
    );

    if (newGraph?.graph) {
      set((state) => ({
        ...state,
        recentGraphs: [...rec, newGraph],
      }));
    } else {
      set((state) => ({
        ...state,
        recentGraphs: [...rec],
      }));
    }
  },

  resetRecentGraphs: () => {
    set((state) => ({
      ...state,
      recentGraphs: [],
    }));
  },
});

export default recentGraphs;
