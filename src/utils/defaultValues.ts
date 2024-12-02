import { MarkerType } from '@xyflow/react';

export const DEFAULT_NODE_VALUES = {
  default_inputs: [],
  force_start_node: false,
  default_error_node: false,
  default_error_attributes: {
    map_all_data: true,
    data_mapping: [],
  },
  uiProps: {
    moreHandles: false,
    withImage: true,
  },
};

export const DEFAULT_LINK_VALUES = {
  data_mapping: [],
  conditions: [],
  required: false,
  on_error: false,
  uiProps: {
    animated: false,
    markerEnd: { type: MarkerType.ArrowClosed },
    type: 'default',
  },
};
