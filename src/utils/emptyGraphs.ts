import type { Graph, Workflow } from '../types';

export const EMPTY_GRAPH: Workflow = {
  graph: {
    id: '',
    label: '',
    input_nodes: [],
    output_nodes: [],
    uiProps: {},
  },
  nodes: [],
  links: [],
};

export const EMPTY_RF_GRAPH: Graph = {
  graph: {
    id: '',
  },
  nodes: [],
  links: [],
};
