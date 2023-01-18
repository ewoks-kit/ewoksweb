import type { GraphRF, State } from '../types';
import type { GetState, SetState } from 'zustand';

export interface RecentGraphsSlice {
  recentGraphs: GraphRF[];
  setRecentGraphs: (newGraph: GraphRF, reset?: boolean) => void;
}

const recentGraphs = (
  set: SetState<State>,
  get: GetState<State>
): RecentGraphsSlice => ({
  recentGraphs: [],

  setRecentGraphs: (newGraph, reset = false) => {
    const rec: GraphRF[] = reset
      ? []
      : get().recentGraphs.filter((gr) => gr.graph.id !== newGraph.graph.id);

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
});

export default recentGraphs;
