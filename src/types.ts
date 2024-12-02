import type { Node } from '@xyflow/react';
import type { Edge, XYPosition } from '@xyflow/react';
import type { CSSProperties } from 'react';

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
  borderColor?: string;
  width?: number;
  height?: number;
}

export interface DataMapping {
  rowId: string;
  source: string | number;
  target: string | number;
}

export type Condition = InputTableRow;

export interface DefaultErrorAttributes {
  map_all_data?: boolean;
  data_mapping?: DataMapping[];
}

export interface SubgraphOutputsInputs {
  label: string;
  positionY?: number;
}

export interface NodeUiProps {
  icon?: string;
  style?: CSSProperties;
  withImage?: boolean;
  borderColor?: string;
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
  default_error_attributes?: DefaultErrorAttributes;
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
