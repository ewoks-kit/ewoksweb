import create from 'zustand';
import type { State } from '../types';

import currentExecutionEvent from './currentExecutionEvent';
import gettingFromServer from './gettingFromServer';
import undoRedo from './undoRedo';
import selectedElement from './selectedElement';
import selectedTask from './selectedTask';
import workingGraph from './workingGraph';
import graphRF from './graphRF';
import allWorkflows from './allWorkflows';
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
import tasks from './tasks';
import undoIndex from './undoIndex';
import executedWorkflows from './executedWorkflows';
import watchedWorkflows from './watchedWorkflows';
import canvasGraphChanged from './canvasGraphChanged';
import {
  initializedTask,
  initializedGraph,
  initializedRFGraph,
} from '../utils/InitializedEntities';

const useStore = create<State>((set, get) => ({
  ...allIcons(set),
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

// @ts-expect-error
if (window.Cypress) {
  // @ts-expect-error
  window.__useStore__ = useStore;
}

export default useStore;
