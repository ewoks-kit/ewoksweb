import type { Node } from '@xyflow/react';
import type { Edge, MarkerType, XYPosition } from '@xyflow/react';
import type { CSSProperties } from 'react';

export interface EwoksIONode {
  id: string;
  node: string;
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
  withLabel?: boolean;
  colorBorder?: string;
}

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

export type TaskType =
  | 'graphInput'
  | 'graph'
  | 'method'
  | 'ppfmethod'
  | 'ppfport'
  | 'graphOutput'
  | 'class'
  | 'note'
  | 'script'
  | 'subworkflow'
  | 'generated'
  | 'notebook';

export interface Task {
  task_type: TaskType;
  task_identifier: string;
  category?: string;
  icon?: string;
  required_input_names?: string[] | null;
  optional_input_names?: string[] | null;
  output_names?: string[] | null;
}

export type DefaultInput = InputTableRow;

export interface EwoksDefaultInput {
  name: string | number;
  value: unknown;
}

export interface GraphUiProps {
  comment?: string;
  notes?: Note[];
}

export interface LinkStyle {
  stroke?: string;
  strokeWidth?: string;
}

export interface Note {
  id: string;
  label?: string;
  comment?: string;
  position: XYPosition;
  colorBorder?: string;
  width?: number;
  height?: number;
}

export interface EwoksDataMapping {
  source_output?: string | number;
  target_input?: string | number;
}

export interface DataMapping {
  rowId: string;
  source: string | number;
  target: string | number;
}

export interface EwoksCondition {
  source_output: string | number;
  value: unknown;
}

export type Condition = InputTableRow;

export interface DefaultErrorAttributes<T = DataMapping | EwoksDataMapping> {
  map_all_data?: boolean;
  data_mapping?: T[];
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
  default_error_attributes?: DefaultErrorAttributes<EwoksDataMapping>;
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
  withLabel?: boolean;
  colorBorder?: string;
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
  uiProps?: LinkUiProps;
  startEnd?: boolean;
}

export interface SubgraphOutputsInputs {
  label: string;
  positionY?: number;
}

export interface NodeUiProps {
  icon?: string;
  style?: CSSProperties;
  withImage?: boolean;
  withLabel?: boolean;
  colorBorder?: string;
  moreHandles?: boolean;
  // To position inputs-outputs of subgraphs in a graph
  inputs?: SubgraphOutputsInputs[];
  outputs?: SubgraphOutputsInputs[];
}

export type NodeTaskProperties = Omit<Task, 'icon'>;

export interface EwoksNodeProperties {
  label?: string;
  default_inputs?: DefaultInput[];
  force_start_node?: boolean;
  task_generator?: string;
  default_error_node?: boolean;
  default_error_attributes?: DefaultErrorAttributes<DataMapping>;
}

export interface NodeData {
  task_props: NodeTaskProperties;
  ewoks_props: EwoksNodeProperties;
  ui_props: NodeUiProps;
  comment?: string;
}

export type NodeWithData = Node & { data: NodeData };
export type RFNode = Node<Record<string, never>>;

export type RowValue = string | object | boolean | number | null;

export interface InputTableRow {
  rowId: string;
  name: string | number;
  value: RowValue;
  type: RowType;
}

export enum RowType {
  Bool = 'bool',
  Dict = 'dict',
  Number = 'number',
  Null = 'null',
  List = 'list',
  String = 'string',
}

export interface Options {
  values: string[];
  requiredValues: string[];
}

export interface LinkData {
  data_mapping?: DataMapping[];
  comment?: string;
  conditions?: Condition[];
  on_error?: boolean;
  map_all_data?: boolean;
  required?: boolean;
  sub_target?: string;
  sub_target_attributes?: Record<string, unknown>;
  sub_source?: string;
  links_input_names?: string[] | null;
  links_required_output_names?: string[] | null;
  links_optional_output_names?: string[] | null;
  startEnd?: boolean;
}

// For data still being optional in Edge
// https://github.com/wbkd/react-flow/issues/1679#issuecomment-1438743754
export type RFEdge = Edge<Record<string, never>>;
export type EdgeWithData = Edge & { data: LinkData };

export interface LabelBgStyle {
  fill?: string;
  color?: string;
  fillOpacity?: number;
  strokeWidth?: string;
  stroke?: string;
}

export interface LabelStyle {
  color?: string;
  fill?: string;
  fontWeight?: number;
  fontSize?: number;
}

export interface LinkUiProps {
  label?: string;
  type?: string;
  comment?: string;
  animated?: boolean;
  markerEnd?: EwoksMarkerEndLegacy;
  labelStyle?: CSSProperties;
  labelBgStyle?: CSSProperties;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  style?: CSSProperties;
}

export interface Workflow {
  graph: GraphDetails;
  nodes?: EwoksNode[];
  links?: EwoksLink[];
}

export interface Icon {
  name: string;
  data_url: string;
}

export interface WorkflowDescription {
  id: string;
  label?: string;
  category?: string;
}

export interface filterParams {
  workflow_id?: string;
  status?: string;
  starttime?: string;
  endtime?: string;
  // sets context filters out within the job array that is not practical
  // context: string;
  node_id?: string;
  // TODO: filter jobs that include this task_id and give back all jobs' steps?
  task_id?: string;
  user_name?: string;
  job_id?: string;
  // type: string;
  error?: boolean;
}

export interface ElementState {
  element: HTMLElement | undefined;
  setElement: (element: HTMLElement | undefined) => void;
}

export enum WorkflowSource {
  Server = 'server',
  Disk = 'disk',
  Empty = 'empty',
}

export type RFMarkerEnd = Edge['markerEnd'];

export type EwoksMarkerEndLegacy = { type: string } | string;
export type EwoksMarkerEnd = MarkerType | 'none';
