import type { State } from '../types';
import type { GetState, SetState } from 'zustand';

// DOC: when UI in execution mode

export interface InExecutionModeSlice {
  inExecutionMode?: boolean;
  setInExecutionMode?: (val: boolean) => void;
}

const inExecutionMode = (
  set: SetState<State>,
  get: GetState<State>
): InExecutionModeSlice => ({
  inExecutionMode: false,

  setInExecutionMode: (val: boolean) => {
    set((state) => ({
      ...state,
      inExecutionMode: val,
    }));

    // when execution stops by user the execution nodes are removed from the graph
    if (!val) {
      set((state) => ({
        ...state,
        // only for testing set graphRF
        graphRF: {
          ...get().graphRF,
          nodes: get().graphRF.nodes.filter(
            (nod) => nod.type !== 'executionSteps'
          ),
        },
        executingEvents: [],
      }));
    } else {
      // when execution starts
    }
  },
});

export default inExecutionMode;
