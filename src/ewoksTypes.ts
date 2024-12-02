/* Types following the Ewoks spec. Used in server responses */

import type { MarkerType, XYPosition } from '@xyflow/react';

import type {
  GraphUiProps,
  LinkStyle,
  SubgraphOutputsInputs,
  TaskType,
} from './types';

export interface GraphDetails {
  id: string;
  label?: string;
  category?: string;
  input_nodes?: EwoksIONode[];
  output_nodes?: EwoksIONode[];
  uiProps?: GraphUiProps;
  keywords?: object;
  input_schema?: object;
  ui_schema?: object;
  execute_arguments?: object;
  worker_options?: object;
}

export interface EwoksIONode {
  id: string;
  node: string | null;
  sub_node?: string;
  link_attributes?: EwoksIOLinkAttributes;
  uiProps?: EwoksIONodeUiProps;
}

// TODO: examine with ewoks if all the following are needed in an InOutLink
export interface EwoksIOLinkAttributes {
  label?: string;
  comment?: string;
  conditions?: EwoksCondition[];
  data_mapping?: EwoksDataMapping[];
  map_all_data?: boolean;
  on_error?: boolean;
  required?: boolean;
}

export interface EwoksIONodeUiProps {
  label?: string;
  position?: XYPosition;
  style?: LinkStyle;
  animated?: boolean;
  markerEnd?: EwoksMarkerEnd;
  targetHandle?: string;
  withImage?: boolean;
  borderColor?: string;
}

export interface EwoksEvent {
  context: string;
  host_name: string;
  job_id: string;
  process_id: string;
  time: string;
  type: string;
  user_name: string;
  workflow_id?: string;
  error_message?: string;
  output_uris?: unknown[];
  error?: boolean;
  error_traceback?: string;
  task_uri?: string;
  task_id?: string;
  input_uris?: unknown[];
  binding?: string;
  progress?: string;
  node_id?: string;
}

export interface EwoksDataMapping {
  source_output?: string | number;
  target_input?: string | number;
}

export interface EwoksCondition {
  source_output: string | number;
  value: unknown;
}

export interface EwoksDefaultErrorAttributes {
  map_all_data?: boolean;
  data_mapping?: EwoksDataMapping[];
}

export interface EwoksDefaultInput {
  name: string | number;
  value: unknown;
}

export interface EwoksNode {
  id: string;
  label?: string;
  task_identifier: string;
  task_type: TaskType;
  task_generator?: string;
  default_inputs?: EwoksDefaultInput[];
  force_start_node?: boolean;
  default_error_node?: boolean;
  default_error_attributes?: EwoksDefaultErrorAttributes;
  uiProps?: EwoksNodeUiProps;
}

export interface EwoksNodeUiProps {
  icon?: string;
  comment?: string;
  position?: XYPosition;
  width?: number;
  height?: number;
  style?: LinkStyle;
  withImage?: boolean;
  borderColor?: string;
  moreHandles?: boolean;
  inputs?: SubgraphOutputsInputs[];
  outputs?: SubgraphOutputsInputs[];
}

export interface EwoksLink {
  source: string;
  sub_source?: string;
  target: string;
  sub_target?: string;
  data_mapping?: EwoksDataMapping[];
  map_all_data?: boolean;
  conditions?: EwoksCondition[];
  required?: boolean;
  on_error?: boolean;
  uiProps?: EwoksLinkUiProps;
  startEnd?: boolean;
}

export interface EwoksLinkUiProps {
  label?: string;
  type?: string;
  comment?: string;
  animated?: boolean;
  markerEnd?: EwoksMarkerEndLegacy;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  color?: string;
}

export interface Workflow {
  graph: GraphDetails;
  nodes?: EwoksNode[];
  links?: EwoksLink[];
}

export type EwoksMarkerEndLegacy = { type: string } | string;
export type EwoksMarkerEnd = MarkerType | 'none';
