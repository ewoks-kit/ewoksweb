import type { GraphEwoks, GraphRF } from '../types';

export const initializedGraph: GraphEwoks = {
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

export const initializedRFGraph: GraphRF = {
  graph: {
    id: '',
    label: '',
  },
  nodes: [],
  links: [],
};
