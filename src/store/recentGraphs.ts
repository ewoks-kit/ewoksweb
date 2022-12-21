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
    let rec = [];
    if (!reset) {
      rec =
        get().recentGraphs.length > 0
          ? get().recentGraphs.filter((gr) => {
              return gr.graph.id !== newGraph.graph.id;
            })
          : [];
    }
    if (newGraph.graph) {
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
