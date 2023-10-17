import { create } from 'zustand';

import type { Graph } from '../types';

interface State {
  graph: Graph | undefined;
  setGraph: (graph: Graph) => void;
}

const useWorkflowToRestore = create<State>((set) => ({
  graph: undefined,
  setGraph: (graph: Graph) => {
    set({
      graph,
    });
  },
}));

export default useWorkflowToRestore;
