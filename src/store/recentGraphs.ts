import type { GraphRF, State } from '../types';
import type { GetState, SetState } from 'zustand';

export interface RecentGraphsSlice {
  recentGraphs: GraphRF[];
  addRecentGraph: (newGraph: GraphRF) => void;
  readdRecentGraph: () => void;
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
    // TODO: examine the need of this if
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

  readdRecentGraph: () => {
    set((state) => ({
      ...state,
      recentGraphs: [],
    }));
  },
});

export default recentGraphs;
