import type { CSSProperties } from 'react';
import type { Edge, EdgeMarkerType, XYPosition } from 'reactflow';
import type { Node } from 'reactflow';

import type { DisplayedWorkflowInfoSlice } from './store/displayedWorkflowInfo';
import type { LoadedGraphsSlice } from './store/loadedGraphs';
import type { RootWorkflowSlice } from './store/rootWorkflow';

export enum GraphFormAction {
  cloneGraph = 'cloneGraph',
  newGraph = 'newGraph',
  newGraphOrOverwrite = 'newGraphOrOverwrite',
}

export interface InputOutputNodeAndLink {
  id: string;
  node: string;
  sub_node?: string;
  link_attributes?: InputOutputLinkAttributes;
  uiProps?: InputOutputUiProps;
}

// TODO: examine with ewoks if all the following are needed in an InOutLink
export interface InputOutputLinkAttributes {
  label?: string;
  comment?: string;
  conditions?: EwoksCondition[];
  data_mapping?: EwoksDataMapping[];
  map_all_data?: boolean;
  on_error?: boolean;
  required?: boolean;
}

export interface InputOutputUiProps {
  label?: string;
  position?: XYPosition;
  style?: LinkStyle;
  animated?: boolean;
  markerEnd?: EdgeMarkerType;
  markerStart?: EdgeMarkerType;
  targetHandle?: string;
  withImage?: boolean;
  withLabel?: boolean;
  colorBorder?: string;
  nodeWidth?: number;
}

export interface GraphDetails {
  id: string;
  label?: string;
  category?: string;
  input_nodes?: InputOutputNodeAndLink[];
  output_nodes?: InputOutputNodeAndLink[];
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

export interface State
  extends DisplayedWorkflowInfoSlice,
    LoadedGraphsSlice,
    RootWorkflowSlice {}

export interface Action {
  action: string;
  graph: Graph;
}

export type TaskType =
  | 'graphInput'
  | 'graph'
  | 'method'
  | 'ppfmethod'
  | 'graphOutput'
  | 'class'
  | 'note'
  | 'script'
  | 'subworkflow'
  | 'generated';

export interface Task {
  task_type: TaskType;
  task_identifier: string;
  category?: string;
  icon?: string;
  required_input_names?: string[];
  optional_input_names?: string[];
  output_names?: string[];
}

export interface DefaultInput {
  id?: string;
  name: string | number;
  value: unknown;
  type?: string;
}

export interface EwoksDefaultInput extends Omit<DefaultInput, 'id' | 'type'> {}

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
  nodeWidth?: number;
  colorBorder?: string;
}

export interface EwoksDataMapping {
  source_output?: string | number;
  target_input?: string | number;
}

export interface DataMapping {
  value?: string | number;
  id?: string;
  name?: string;
}

export interface EwoksCondition {
  source_output?: string | number;
  value: unknown;
}

export interface Condition {
  value: unknown;
  id?: string;
  name?: string;
  type?: string;
}

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
  inputs_complete?: boolean;
  default_error_node?: boolean;
  default_error_attributes?: DefaultErrorAttributes<EwoksDataMapping>;
  uiProps?: EwoksNodeUiProps;
}

export interface EwoksNodeUiProps {
  icon?: string;
  comment?: string;
  position?: XYPosition;
  style?: LinkStyle;
  withImage?: boolean;
  withLabel?: boolean;
  colorBorder?: string;
  nodeWidth?: number;
  task_category?: string;
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
  nodeWidth?: number;
  moreHandles?: boolean;
  // To position inputs-outputs of subgraphs in a graph
  inputs?: SubgraphOutputsInputs[];
  outputs?: SubgraphOutputsInputs[];
}

export interface NodeTaskProperties {
  task_type: TaskType;
  task_identifier: string;
  task_category?: string;
  optional_input_names?: string[];
  output_names?: string[];
  required_input_names?: string[];
}

export interface EwoksNodeProperties {
  label?: string;
  default_inputs?: DefaultInput[];
  inputs_complete?: boolean;
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

<<<<<<< HEAD
export type NodeWithData = Node<NodeData>;
=======
export type NodeWithData = Node<NodeData> & { data: NodeData };
>>>>>>> ccb581eefa3cb7e8e50d92feed5f87611648f93e
export type RFNode = Omit<Node, 'data'>;
// From new reactFlow11:
// width?: number | null; // what is their functionality?
// height?: number | null;

export interface EditableTableRow {
  id?: string;
  name?: string;
  value?: unknown;
  type?: string;
  // TODO
  // export type AllowedTypesOfValues =
  // 'string'
  // | 'bool'
  // | 'number'
  // | 'boolean'
  // | 'null'
  // | 'list'
  // | 'dict'
  // | undefined;
}

export interface TypeOfValues {
  typeOfInput: 'select' | 'input';
  values?: string[];
  requiredValues?: string[];
}

export interface CustomTableCellProps {
  index: number;
  row: EditableTableRow;
  rowsNames?: string[];
  name: 'name' | 'value';
  typeOfValues?: TypeOfValues;
  usedIn?: 'DataMapping' | 'DefaultInputs' | 'Conditions';
  disable?: boolean;
  onEdit?: () => void;
  onChange(
    e: { target: { name: string; value: string | number } },
    row: EditableTableRow,
    index: number,
  ): void;
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
  getAroundProps?: { x?: number; y?: number };
  links_input_names?: string[];
  links_required_output_names?: string[];
  links_optional_output_names?: string[];
  startEnd?: boolean;
}

// For data still being optional in Edge
// https://github.com/wbkd/react-flow/issues/1679#issuecomment-1438743754
export type Link = Omit<Edge, 'data'>;
<<<<<<< HEAD
export type LinkWithData = Edge<LinkData>;

// export interface LinkWithData extends NoDataEdge {
//   data: LinkData;
// }
=======
export type LinkWithData = Edge<LinkData> & { data: LinkData };
>>>>>>> ccb581eefa3cb7e8e50d92feed5f87611648f93e

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
  markerEnd?: EdgeMarkerType;
  markerStart?: EdgeMarkerType;
  labelStyle?: CSSProperties;
  labelBgStyle?: CSSProperties;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  style?: CSSProperties;
  getAroundProps?: { x?: number; y?: number };
}

export interface Graph {
  graph: GraphDetails;
  nodes: NodeWithData[];
  links: LinkWithData[];
}

export interface Workflow {
  graph: GraphDetails;
  nodes: EwoksNode[];
  links: EwoksLink[];
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

export interface SelectedElement {
  selectedElement: Node | Edge | undefined;
}
