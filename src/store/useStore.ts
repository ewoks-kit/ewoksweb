import create from 'zustand';
import type { GraphEwoks, GraphRF, State, Task } from '../types';

import currentExecutionEvent from './currentExecutionEvent';
import gettingFromServer from './gettingFromServer';
import undoRedo from './undoRedo';
import selectedElement from './selectedElement';
import selectedTask from './selectedTask';
import workingGraph from './workingGraph';
import graphRF from './graphRF';
import allWorkflows from './allWorkflows';
import allIconNames from './allIconNames';
import allIcons from './allIcons';
import executingEvents from './executingEvents';
import executedEvents from './executedEvents';
import graphOrSubgraph from './graphOrSubgraph';
import inExecutionMode from './inExecutionMode';
import openDraggableDialog from './openDraggableDialog';
import openSettingsDrawer from './openSettingsDrawer';
import openSnackbar from './openSnackbar';
import recentGraphs from './recentGraphs';
import subGraph from './subGraph';
import subgraphsStack from './subgraphsStack';
import taskCategories from './taskCategories';
import tasks from './tasks';
import undoIndex from './undoIndex';
import executedWorkflows from './executedWorkflows';
import watchedWorkflows from './watchedWorkflows';
import canvasGraphChanged from './canvasGraphChanged';

const initializedTask: Task = {
  task_identifier: '',
  task_type: '',
  icon: '',
  category: '',
  optional_input_names: [],
  output_names: [],
  required_input_names: [],
};

const initializedGraph: GraphEwoks = {
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

const initializedRFGraph: GraphRF = {
  graph: {
    id: 'newGraph',
    label: '',
  },
  nodes: [],
  links: [],
};

const useStore = create<State>((set, get) => ({
  ...allIconNames(set),
  ...allIcons(set, get),
  ...allWorkflows(set),
  ...currentExecutionEvent(set),
  ...executedEvents(set, get),
  ...executingEvents(set, get),
  ...executedWorkflows(set),
  ...watchedWorkflows(set, get),
  ...inExecutionMode(set, get),
  ...gettingFromServer(set),
  ...graphOrSubgraph(set),
  ...graphRF(set, get),
  ...canvasGraphChanged(set),
  ...openDraggableDialog(set),
  ...openSettingsDrawer(set),
  ...openSnackbar(set),
  ...recentGraphs(set, get),
  ...subGraph(set, get),
  ...subgraphsStack(set, get),
  // ...taskCategories(set),
  ...tasks(set),
  ...undoIndex(set, get),
  ...undoRedo(set, get),
  ...selectedElement(set, get),
  ...selectedTask(set),
  ...workingGraph(set, get),
  initializedTask,
  initializedGraph,
  initializedRFGraph,
}));

// @ts-ignore
if (window.Cypress) {
  // @ts-ignore
  window.__useStore__ = useStore;
}

export default useStore;
