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
    id: '',
    label: 'untitled_workflow',
    input_nodes: [],
    output_nodes: [],
    uiProps: {
      notes: [
        {
          id: 'Note-for-untitled_workflow',
          label:
            'Open a workflow from the top-right or drag-and-drop nodes from the left sidebar to create a new',
          comment: '',
          position: {
            x: 570,
            y: 390,
          },
          nodeWidth: 248,
        },
      ],
    },
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
