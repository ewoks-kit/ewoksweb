import type { GraphRF } from '../types';

const initializedGraph = {
  graph: {
    id: 'newGraph',
    label: 'newGraph',
    input_nodes: [],
    output_nodes: [],
    uiProps: {},
  },
  nodes: [],
  links: [],
} as GraphRF;

const graphRF = (set, get) => ({
  graphRF: initializedGraph,

  setGraphRF: (graphRF) => {
    // If missing uiProps or other fill it here
    if (!graphRF.graph.uiProps) {
      graphRF.graph.uiProps = {};
    }
    set((state) => ({
      ...state,
      graphRF,
    }));
  },
});

export default graphRF;
