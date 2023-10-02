import type { GraphEwoks, GraphRF } from '../types';

export const EMPTY_GRAPH: GraphEwoks = {
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

export const EMPTY_RF_GRAPH: GraphRF = {
  graph: {
    id: '',
  },
  nodes: [],
  links: [],
};
