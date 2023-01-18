import type { Position } from 'react-flow-renderer';
import type { CanvasGraphChangedSlice } from './store/canvasGraphChanged';
import type { AllWorkflowsSlice } from './store/allWorkflows';
import type { CurrentExecutionEventSlice } from './store/currentExecutionEvent';
import type { ExecutedEventsSlice } from './store/executedEvents';
import type { GraphRFSlice } from './store/graphRF';
import type { ExecutedWorkflowsSlice } from './store/executedWorkflows';
import type { InExecutionModeSlice } from './store/inExecutionMode';
import type { OpenDraggableDialogSlice } from './store/openDraggableDialog';
import type { GettingFromServerSlice } from './store/gettingFromServer';
import type { GraphOrSubgraphSlice } from './store/graphOrSubgraph';
import type { OpenSettingsDrawerSlice } from './store/openSettingsDrawer';
import type { OpenSnackbarSlice } from './store/openSnackbar';
import type { SelectedElementSlice } from './store/selectedElement';
import type { SelectedTaskSlice } from './store/selectedTask';
import type { SubgraphsStackSlice } from './store/subgraphsStack';
import type { SubGraphSlice } from './store/subGraph';
import type { TasksSlice } from './store/tasks';
import type { UndoIndexSlice } from './store/undoIndex';
import type { UndoRedoSlice } from './store/undoRedo';
import type { WatchedWorkflowsSlice } from './store/watchedWorkflows';
import type { WorkingGraphSlice } from './store/workingGraph';
import type { ExecutingEventsSlice } from './store/executingEvents';
import type { AllIconsSlice } from './store/allIcons';
import type { RecentGraphsSlice } from './store/recentGraphs';
import type { Color } from '@material-ui/lab';

export enum FormAction {
  undefined = 'undefined',
  cloneGraph = 'cloneGraph',
  newGraph = 'newGraph',
  newGraphOrOverwrite = 'newGraphOrOverwrite',
  cloneTask = 'cloneTask',
  newTask = 'newTask',
  editTask = 'editTask',
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
  conditions: Conditions[];
  data_mapping: DataMapping[];
  map_all_data: boolean;
  on_error: boolean;
}

export interface InOutNodesUiProps {
  label?: string;
  position?: CanvasPosition;
  linkStyle?: string;
  style?: LinkStyle;
  animated?: boolean;
  markerEnd?: '' | { type: string };
  // TODO: the following is not used for now
  markerStart?: { type: string };
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
  uiProps?: UiPropsGraph;
}

export interface Graph {
  graph?: GraphDetails;
  nodes: EwoksNode[];
  links: EwoksLink[];
}

export interface SnackbarParams {
  open: boolean;
  text: string | undefined;
  severity: Color;
}

export interface DialogParams {
  open: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any; // {title: string; graph: }
}

// I need the EVENTS=[{nodeId, start/end, values: {}}] somewhere and the
// execGraphRF = a graph upon graphRF structure that builds the execution-timeline
// this line has what happened and when = state is in execGraphRF
// Not play it from the beggining to view the state in a specific time-instanse
// for a time-instanse we need
// 1. what nodes were being executing and
// 2. the results until now for the executed
// 3. the way things happened in a timely manner?

// to draw them on links we need to know where it came from? Not possible
// so draw them on node input/output
// stop for one is not the start of another which can wait for other inputs!
// so draw on link on each side the events in a timely manner.

export interface ExecutedWorkflowEvent extends Event {
  status: string;
}

export interface ExecutedJobsResponse {
  jobs: Event[][];
}

export interface Event {
  host_name?: string;
  process_id?: string;
  user_name?: string;
  job_id?: string;
  binding?: string;
  context?: string;
  workflow_id?: string;
  type?: string;
  time?: string;
  error?: string;
  error_message?: string;
  error_traceback?: string;
  node_id?: string;
  task_id?: string;
  progress?: string;
  task_uri?: string;
  input_uris?: [];
  output_uris?: [];
  id?: number;
  nodeId: string;
  status?: string;
  event_type: string; // start/stop/progress events
  values: Record<string, unknown>; // all values entering or exiting a node
  // for now put static executing here
  executing?: string[];
}

export interface ExecutingState {
  executingNodes: [string];
  executed: [NodeExecutionHistory];
  eventId: string; // the point on the timeline of events is the unique id in this entity
}

// For visuaization
export interface NodeExecutionHistory {
  id: string; // the unique number on the graph 1,2,3
  eventId: string; // find the event for that time-point
  // the ExecutingState can be found through the eventId again
}

export interface State
  extends CanvasGraphChangedSlice,
    AllWorkflowsSlice,
    AllIconsSlice,
    GraphRFSlice,
    CurrentExecutionEventSlice,
    ExecutedEventsSlice,
    ExecutedWorkflowsSlice,
    InExecutionModeSlice,
    OpenDraggableDialogSlice,
    GettingFromServerSlice,
    GraphOrSubgraphSlice,
    OpenSettingsDrawerSlice,
    OpenSnackbarSlice,
    SelectedElementSlice,
    SelectedTaskSlice,
    SubgraphsStackSlice,
    SubGraphSlice,
    TasksSlice,
    UndoIndexSlice,
    // TODO: check if index above can be merged with undoRedo below
    UndoRedoSlice,
    WatchedWorkflowsSlice,
    WorkingGraphSlice,
    ExecutingEventsSlice,
    RecentGraphsSlice {
  initializedGraph: GraphEwoks;
  initializedRFGraph: GraphRF;
  initializedTask: Task;
}

export interface Action {
  action: string;
  graph: GraphRF;
}

export interface NodeProps {
  nodeWidth?: number;
  withImage?: boolean;
  withLabel?: boolean;
  moreHandles: boolean;
  isGraph: boolean;
  type: string;
  label: string;
  selected: boolean;
  color?: string;
  colorBorder?: string;
  content: React.ReactNode;
  image?: string;
  comment?: string;
  executing?: boolean;
  details?: boolean;
}

export interface Task {
  task_type?: string;
  task_identifier?: string;
  default_inputs?: Inputs[];
  inputs_complete?: boolean;
  task_generator?: string;
  optional_input_names?: string[];
  output_names?: string[];
  required_input_names?: string[];
  icon?: string;
  category?: string;
}

export interface Inputs {
  id?: string;
  name: string;
  value: unknown;
}

export interface nodeInputsOutputs {
  optional_input_names?: string[];
  output_names?: string[];
  required_input_names?: string[];
}

export interface stackGraph {
  id: string;
  label?: string;
  resetStack?: boolean;
}

export interface UiPropsNodes {
  type?: string;
  icon?: string;
  comment?: string;
  position?: CanvasPosition;
  style?: LinkStyle;
  withImage?: boolean;
  withLabel?: boolean;
  colorBorder?: string;
  nodeWidth?: number;
  node_icon?: string;
  task_icon?: string;
  task_category?: string;
  moreHandles?: boolean;
  details?: boolean;
}

export interface UiPropsLinks {
  label?: string;
  type?: string;
  comment?: string;
  animated?: boolean;
  markerEnd?: '' | { type: string };
  labelStyle?: {
    color?: string;
    fill?: string;
    fontWeight?: number;
    fontSize?: number;
  };
  labelBgStyle?: {
    fill?: string;
    color?: string;
    fillOpacity?: number;
    strokeWidth?: string;
    stroke?: string;
  };
  markerStart?: { type: string };
  sourceHandle?: string;
  targetHandle?: string;
  colorLink?: string;
  style?: LinkStyle;
  getAroundProps?: { x?: number; y?: number };
  withImage?: boolean;
  withLabel?: boolean;
  colorBorder?: string;
  nodeWidth?: number;
}

export interface UiPropsGraph {
  label?: string;
  type?: string;
  comment?: string;
  notes?: Note[];
  style?: LinkStyle;
  source?: string;
  icon?: string;
}

export interface LinkStyle {
  stroke?: string;
  strokeWidth?: string;
}

export interface Note {
  id: string;
  label?: string;
  comment: string;
  position: CanvasPosition;
  nodeWidth: number;
}

export interface CanvasPosition {
  x: number;
  y: number;
}

export interface DataMapping {
  source_output?: string;
  target_input?: string;
  value?: unknown;
  id?: string;
  name?: string;
}

export interface Conditions {
  source_output?: string;
  value: unknown;
  id?: string;
  name?: string;
}

export interface DefaultErrorAttributes {
  map_all_data?: boolean;
  data_mapping?: DataMapping[];
}

export interface EwoksNode {
  id: string;
  label?: string;
  category?: string;
  task_type: string;
  task_identifier: string;
  default_inputs?: Inputs[];
  inputs_complete?: boolean;
  task_generator?: string;
  default_error_node?: boolean;
  default_error_attributes?: DefaultErrorAttributes;
  uiProps?: UiPropsNodes;
}

export interface EwoksLink {
  id?: string;
  source: string;
  target: string;
  map_all_data?: boolean;
  required?: boolean;
  data_mapping?: DataMapping[];
  conditions?: Conditions[];
  on_error?: boolean;
  sub_target?: string;
  sub_source?: string;
  startEnd?: boolean;
  uiProps?: UiPropsLinks;
}

export interface outputsInputsSub {
  label: string;
  type: string;
  positionY?: number;
}

export interface EwoksRFNodeData {
  nodeWidth?: number;
  node_icon?: string;
  executing?: boolean;
  exists?: boolean;
  label?: string;
  type?: string;
  inputs?: outputsInputsSub[]; // ?
  outputs?: outputsInputsSub[]; // ?
  icon?: string;
  comment?: string;
  moreHandles?: boolean;
  details?: boolean;
  withImage?: boolean;
  withLabel?: boolean;
  colorBorder?: string;
  map_all_data?: boolean;
}
export interface EwoksRFNode {
  id: string;
  label?: string;
  category?: string;
  task_type: string;
  type?: string;
  task_identifier: string;
  task_icon?: string;
  task_category?: string;
  default_inputs?: Inputs[];
  inputs_complete?: boolean;
  task_generator?: string;
  default_error_node?: boolean;
  default_error_attributes?: DefaultErrorAttributes;
  data: EwoksRFNodeData;
  selected?: boolean;
  sourcePosition?: string;
  targetPosition?: string;
  position?: CanvasPosition;
  optional_input_names?: string[];
  output_names?: string[];
  required_input_names?: string[];
  uiProps?: UiPropsNodes;
}

export interface EditableTableRow {
  id?: string;
  name?: string;
  value?: unknown; // string | number | null | undefined | boolean | Record<string, unknown>;
  isEditMode?: boolean;
  type?: string;
}

export interface CustomTableCellProps {
  index: number;
  row: EditableTableRow;
  name: string;
  type?: string;
  typeOfValues: { type: string; values?: string[] };
  onChange(
    e: { target: { name: string; value: string | number } },
    row: EditableTableRow,
    index: number
  ): void;
}

export interface EwoksRFLink {
  id?: string;
  source: string;
  target: string;
  label?: string;
  data: {
    label?: string;
    data_mapping?: DataMapping[];
    type?: string;
    comment?: string;
    conditions?: Conditions[];
    on_error?: boolean;
    map_all_data?: boolean;
    required?: boolean;
    sub_target?: string;
    sub_target_attributes?: Record<string, unknown>;
    sub_source?: string;
    colorLine?: string;
    getAroundProps?: { x?: number; y?: number };
    links_input_names?: string[];
    links_required_output_names?: string[];
    links_optional_output_names?: string[];
  };
  labelStyle?: {
    color?: string;
    fill?: string;
    fontWeight?: number;
    fontSize?: number;
  };
  labelBgStyle?: {
    fill?: string;
    color?: string;
    fillOpacity?: number;
    strokeWidth?: string;
    stroke?: string;
  };
  labelBgPadding?: number[];
  labelBgBorderRadius?: number;
  style: { stroke: string; strokeWidth: string };
  startEnd?: boolean;
  subtarget?: string;
  subsource?: string;
  uiProps?: UiPropsLinks;
  type?: string;
  markerEnd?: '' | { type: string };
  markerStart?: string;
  animated?: boolean;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface RFLink {
  id?: string;
  source: string;
  target: string;
  label?: string;
  data?: {
    data_mapping?: DataMapping;
    type?: string;
    comment?: string;
    conditions?: Conditions[];
    on_error?: Inputs;
  };
  subtarget?: string;
  subsource?: string;
  uiProps?: UiPropsLinks;
}

export interface RFNode {
  id: string;
  label?: string;
  task_type?: string;
  task_identifier?: string;
  default_inputs?: Inputs[];
  inputs_complete?: boolean;
  task_generator?: string;
  data?: {
    label?: string;
    type?: string;
    inputs?: [string]; // ?
    outputs?: [string]; // ?
    icon?: string;
    comment?: string;
  };
  sourcePosition?: Position;
  targetPosition?: Position;
  position?: CanvasPosition;
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

export interface IconsNames {
  identifiers: [string];
}

export interface Icon {
  name: string;
  type?: string;
  image?: { data_url?: string };
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
