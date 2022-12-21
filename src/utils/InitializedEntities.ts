import type { GraphEwoks, GraphRF, Task } from '../types';

export const initializedTask: Task = {
  task_identifier: '',
  task_type: '',
  icon: '',
  category: '',
  optional_input_names: [],
  output_names: [],
  required_input_names: [],
};

export const initializedGraph: GraphEwoks = {
  graph: {
    id: 'newGraph',
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
    id: 'newGraph',
    label: '',
  },
  nodes: [],
  links: [],
};
