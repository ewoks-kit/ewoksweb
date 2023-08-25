import type { Edge, EdgeMarkerType, XYPosition } from 'reactflow';
import type { OpenDraggableDialogSlice } from './store/openDraggableDialog';
import type { OpenSnackbarSlice } from './store/openSnackbar';
import type { SubgraphsStackSlice } from './store/subgraphsStack';
import type { SubGraphSlice } from './store/subGraph';
import type { WorkingGraphSlice } from './store/workingGraph';
import type { RecentGraphsSlice } from './store/recentGraphs';
import type { Color } from '@material-ui/lab';
import type { ChangeEvent, CSSProperties, ReactNode } from 'react';
import type { Node } from 'reactflow';
import type { GraphInfoSlice } from './store/graphInfo';

export enum GraphFormAction {
  cloneGraph = 'cloneGraph',
  newGraph = 'newGraph',
  newGraphOrOverwrite = 'newGraphOrOverwrite',
}

export interface GraphNodes {
  id: string;
  node: string;
  sub_node?: string;
  link_attributes?: InOutLinkAttributes;
  uiProps?: InOutNodesUiProps;
}

// TODO: examine with ewoks if all the following are needed in an InOutLink
export interface InOutLinkAttributes {
  label: string;
  comment: string;
  conditions: ConditionEwoks[];
  data_mapping: DataMappingEwoks[];
  map_all_data: boolean;
  on_error: boolean;
  required: boolean;
}

export interface InOutNodesUiProps {
  label?: string;
  position?: XYPosition;
  linkStyle?: string;
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
  input_nodes?: GraphNodes[];
  output_nodes?: GraphNodes[];
  uiProps?: GraphUiProps;
}

export interface SnackbarParams {
  open: boolean;
  text: string;
  severity: Color;
}

export interface DialogParams {
  open: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
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
  extends GraphInfoSlice,
    OpenDraggableDialogSlice,
    OpenSnackbarSlice,
    SubgraphsStackSlice,
    SubGraphSlice,
    WorkingGraphSlice,
    RecentGraphsSlice {}

export interface Action {
  action: string;
  graph: GraphRF;
}

// These types are being calculated when opening a workflow
// for using them in validation.
// They are not recalculated though wjilw editing the graph.
// Keeping them until we re-implement the graph-validation
// No need to be saved on the server.
export type NodeInGraphType =
  | 'input_output'
  | 'input'
  | 'output'
  | 'graphInput'
  | 'graphOutput'
  | 'internal';

export interface NodeProps {
  id: string;
  nodeWidth?: number;
  withImage?: boolean;
  withLabel?: boolean;
  moreHandles?: boolean;
  type: TaskType;
  label: string;
  color?: string;
  colorBorder?: string;
  content: ReactNode;
  comment?: string;
}

export type TaskType =
  | 'graphInput'
  | 'graph'
  | 'method'
  | 'ppfmethod'
  | 'graphInput'
  | 'graphOutput'
  | 'class'
  | 'note'
  | 'script'
  | 'subworkflow';

export interface Task {
  task_type: TaskType;
  task_identifier: string;
  category?: string;
  icon?: string;
  required_input_names?: string[];
  optional_input_names?: string[];
  output_names?: string[];
}

export interface Inputs {
  id?: string;
  name: string | number;
  value: unknown;
  type?: string;
}

export interface InputsEwoks extends Omit<Inputs, 'id'> {}

export interface stackGraph {
  id: string;
  label?: string;
  resetStack?: boolean;
}

export interface GraphUiProps {
  label?: string;
  type?: string;
  comment?: string;
  notes?: Note[];
  style?: LinkStyle;
  icon?: string;
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

export interface DataMappingEwoks {
  source_output?: string | number;
  target_input?: string | number;
}

export interface DataMapping {
  value?: string | number;
  id?: string;
  name?: string;
}

export interface ConditionEwoks {
  source_output?: string | number;
  value: unknown;
}

export interface Condition {
  value: unknown;
  id?: string;
  name?: string;
  type?: string;
}

export interface DefaultErrorAttributes<T = DataMapping | DataMappingEwoks> {
  map_all_data?: boolean;
  data_mapping?: T[];
}

export interface EwoksNode {
  id: string;
  label?: string;
  task_identifier: string;
  task_type: TaskType;
  task_generator?: string;
  default_inputs?: Inputs[];
  inputs_complete?: boolean;
  default_error_node?: boolean;
  default_error_attributes?: DefaultErrorAttributes<DataMappingEwoks>;
  uiProps?: EwoksNodeUiProps;
}

export interface EwoksNodeUiProps {
  type?: string;
  icon?: string;
  comment?: string;
  position?: XYPosition;
  style?: LinkStyle;
  withImage?: boolean;
  withLabel?: boolean;
  colorBorder?: string;
  nodeWidth?: number;
  task_icon?: string;
  task_category?: string;
  moreHandles?: boolean;
  exists?: boolean;
  inputs?: outputsInputsSub[];
  outputs?: outputsInputsSub[];
}

export interface EwoksLink {
  source: string;
  sub_source?: string;
  target: string;
  sub_target?: string;
  data_mapping?: DataMappingEwoks[];
  map_all_data?: boolean;
  conditions?: ConditionEwoks[];
  required?: boolean;
  on_error?: boolean;
  uiProps?: UiPropsLinks;
  startEnd?: boolean;
}

export interface outputsInputsSub {
  label: string;
  type: string;
  positionY?: number;
}

export interface RFNodeUiProps {
  type?: NodeInGraphType;
  icon?: string;
  style?: CSSProperties;
  withImage?: boolean;
  withLabel?: boolean;
  colorBorder?: string;
  nodeWidth?: number;
  moreHandles?: boolean;
  exists?: boolean;
  // To position inputs-outputs of subgraphs in a graph
  inputs?: outputsInputsSub[];
  outputs?: outputsInputsSub[];
}

export interface RFNodeTaskProperties {
  task_type: TaskType;
  task_identifier: string;
  task_icon?: string;
  task_category?: string;
  optional_input_names?: string[];
  output_names?: string[];
  required_input_names?: string[];
}

export interface RFNodeEwoksProperties {
  label?: string;
  default_inputs?: Inputs[];
  inputs_complete?: boolean;
  task_generator?: string;
  default_error_node?: boolean;
  default_error_attributes?: DefaultErrorAttributes<DataMapping>;
}

export interface EwoksRFNodeData {
  task_props: RFNodeTaskProperties;
  ewoks_props: RFNodeEwoksProperties;
  ui_props: RFNodeUiProps;
  comment?: string;
}

export type EwoksRFNode = Node<EwoksRFNodeData>;
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
  onEdit?: () => void;
  onChange(
    e: { target: { name: string; value: string | number } },
    row: EditableTableRow,
    index: number
  ): void;
}

export interface EwoksRFLinkData {
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
type NoDataEdge = Omit<Edge, 'data'>;
export interface EwoksRFLink extends NoDataEdge {
  data: EwoksRFLinkData;
}

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

export interface UiPropsLinks {
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

export interface GraphRF {
  graph: GraphDetails;
  nodes: EwoksRFNode[];
  links: EwoksRFLink[];
}

export interface GraphEwoks {
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

export interface calcInOutForSubgraphOutput {
  id: string;
  label: string;
  type: string;
  positionY?: number;
}

export interface SelectedElement {
  type: 'graph' | 'node' | 'edge';
  id: string;
}

export interface SelectedElementNode extends SelectedElement {
  type: 'node';
}

export type PropertyChangedEvent = ChangeEvent<{
  name?: string | undefined;
  value: unknown;
}>;

export interface SelectedElementRF {
  selectedElement: Node | Edge | undefined;
}

export type SidebarLayout = 'grid' | 'list';
