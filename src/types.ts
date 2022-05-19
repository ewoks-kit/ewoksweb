// import type { Color } from '@material-ui/lab';
import type { Position } from 'react-flow-renderer';

export interface GraphNodes {
  id: string;
  node: string;
  sub_node?: string;
  uiProps?: UiProps;
}

export interface GraphDetails {
  id: string;
  label?: string;
  input_nodes?: GraphNodes[];
  output_nodes?: GraphNodes[];
  uiProps?: UiProps;
}

export interface Graph {
  graph?: GraphDetails;
  nodes: EwoksNode[];
  links: EwoksLink[];
}

export interface SnackbarParams {
  open: boolean;
  text: string;
  severity: string;
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

export interface ExecutingEvent {
  id: string;
  nodeId: string;
  event_type: string; // start/stop/progress events
  values: {}; // all values entering or exiting a node
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

export interface ExecutionState {
  currentExecutionEvent?: number;
  setCurrentExecutionEvent?: (index: number) => void;

  // executingEvents: ExecutingEvent[];
  // setExecutingEvents: (execEvent: ExecutingEvent) => void;

  // isExecuted: boolean;
  // setIsExecuted: (val: boolean) => void;
}

export interface State {
  currentExecutionEvent?: number;
  setCurrentExecutionEvent?: (index: number) => void;

  executingEvents?: ExecutingEvent[];
  setExecutingEvents?: (execEvent: ExecutingEvent) => void;

  isExecuted?: boolean;
  setIsExecuted?: (val: boolean) => void;

  gettingFromServer?: boolean;
  setGettingFromServer?: (val: boolean) => void;

  undoRedo?: Action[];
  setUndoRedo?: (action: Action) => void;

  undoIndex?: number;
  setUndoIndex?: (index: number) => void;

  initializedGraph?: GraphRF;
  initializedTask?: Task;

  tasks?: Task[];
  setTasks?: (tasks: Task[]) => void;

  taskCategories?: string[];
  setTaskCategories?: (tasks: string[]) => void;

  openDraggableDialog?: DialogParams;
  setOpenDraggableDialog?: (params: DialogParams) => void;

  openSnackbar?: SnackbarParams;
  setOpenSnackbar?: (params: SnackbarParams) => void;

  allIcons?: string[];
  setAllIcons?: (icons: string[]) => void;
  // { name: string; svgFile?: string; file?: File }[]

  allWorkflows?: { title: string }[];
  setAllWorkflows?: (workflows: { title: string }[]) => void;

  recentGraphs?: GraphRF[];
  setRecentGraphs?: (graphRF: GraphRF, reset?: boolean) => void;

  graphOrSubgraph?: boolean;
  setGraphOrSubgraph?: (isItGraph: boolean) => void;

  subgraphsStack?: stackGraph[];
  setSubgraphsStack?: (graphRF: stackGraph) => void;

  graphRF?: GraphRF;
  setGraphRF?: (graphRF: GraphRF) => void;

  selectedElement?: EwoksRFNode | EwoksRFLink;
  setSelectedElement?: (
    element: EwoksRFNode | EwoksRFLink,
    from?: string,
    update?: boolean
  ) => void;

  selectedTask?: Task;
  setSelectedTask?: (task: Task) => void;

  subGraph?: GraphRF;
  setSubGraph?: (graph: GraphEwoks) => Promise<GraphRF>;

  workingGraph?: GraphRF;
  setWorkingGraph?: (graph: GraphRF) => Promise<GraphRF>;
}

export interface Action {
  action: string;
  graph: GraphRF;
}

export interface NodeProps {
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
  uiProps?: UiProps;
}

export interface Inputs {
  id?: string;
  name?: string;
  value?: string | boolean;
}

export interface nodeInputsOutputs {
  optional_input_names?: string[];
  output_names?: string[];
  required_input_names?: string[];
}

export interface stackGraph {
  id: string;
  label: string;
}

// TODO break to uiprops for links and nodes?
export interface UiProps {
  label?: string;
  type?: string;
  icon?: string;
  comment?: string;
  position?: CanvasPosition;
  animated?: boolean;
  markerEnd?: { type: string };
  markerStart?: { type: string };
  arrowHeadTypeanimated?: string;
  sourceHandle?: string;
  targetHandle?: string;
  notes?: Note[];
  colorLink?: string;
  style?: LinkStyle;
}

export interface LinkStyle {
  stroke: string;
  strokeWidth: string;
}

export interface Note {
  id?: string;
  label?: string;
  comment: string;
  position: CanvasPosition;
}

export interface CanvasPosition {
  x: number;
  y: number;
}

export interface DataMapping {
  source_output?: string;
  target_input?: string;
  value?: string | boolean;
  id?: string;
  name?: string;
}

export interface Conditions {
  source_output?: string;
  value?: string | boolean;
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
  task_type?: string;
  task_identifier?: string;
  default_inputs?: Inputs[];
  inputs_complete?: boolean;
  task_generator?: string;
  default_error_node?: boolean;
  default_error_attributes?: DefaultErrorAttributes;
  uiProps?: UiProps;
}

export interface EwoksLink {
  id?: string;
  source: string;
  target: string;
  map_all_data: boolean;
  data_mapping?: DataMapping[];
  conditions?: Conditions[];
  on_error?: boolean;
  sub_target?: string;
  sub_source?: string;
  startEnd?: string;
  uiProps?: UiProps;
}

export interface outputsInputsSub {
  label: string;
  type: string;
}

export interface EwoksRFNode {
  id?: string;
  label?: string;
  task_type?: string;
  type?: string;
  task_identifier?: string;
  task_icon?: string;
  task_category?: string;
  default_inputs?: Inputs[];
  inputs_complete?: boolean;
  task_generator?: string;
  default_error_node?: boolean;
  default_error_attributes?: DefaultErrorAttributes;
  data?: {
    executing?: boolean;
    exists?: boolean;
    label?: string;
    type?: string;
    inputs?: outputsInputsSub[]; // ?
    outputs?: outputsInputsSub[]; // ?
    icon?: string;
    comment?: string;
    moreHandles?: boolean;
    withImage?: boolean;
    withLabel?: boolean;
    colorBorder?: string;
    map_all_data?: boolean; // TODO: not exists in nodes Typescript resolve...
    // on_error?: boolean; // TODO: not exists in nodes Typescript resolve...
  };
  sourcePosition?: string;
  targetPosition?: string;
  position?: CanvasPosition;
  optional_input_names?: string[];
  output_names?: string[];
  required_input_names?: string[];
  uiProps?: UiProps;
}

export interface EwoksRFLink {
  id?: string;
  source: string;
  target: string;
  label?: string;
  data?: {
    label?: string;
    data_mapping?: DataMapping[];
    type?: string;
    comment?: string;
    conditions?: Conditions[];
    on_error?: boolean;
    map_all_data?: boolean;
    sub_target?: string;
    sub_source?: string;
    colorLine?: string;
  };
  labelStyle;
  labelBgStyle;
  style;
  subtarget?: string;
  subsource?: string;
  uiProps?: UiProps;
  type?: string;
  markerEnd?: { type: string };
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
  uiProps?: UiProps;
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
  graph?: GraphDetails;
  nodes: EwoksNode[];
  links: EwoksLink[];
}

export interface IconsNames {
  identifiers: [string];
}

export interface Icons {
  name: string;
  svgFile?: string;
  file?: File;
}
