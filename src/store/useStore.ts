import create from 'zustand';
import type { State } from '../types';
import undoRedo from './undoRedo';
import workingGraph from './workingGraph';
import graphRF from './graphRF';
import openDraggableDialog from './openDraggableDialog';
import openSnackbar from './openSnackbar';
import recentGraphs from './recentGraphs';
import subGraph from './subGraph';
import subgraphsStack from './subgraphsStack';
import tasks from './tasks';
import undoIndex from './undoIndex';
import canvasGraphChanged from './canvasGraphChanged';
import {
  initializedGraph,
  initializedRFGraph,
} from '../utils/InitializedEntities';
import graphInfo from './graphInfo';

const useStore = create<State>((set, get) => ({
  ...graphRF(set, get),
  ...graphInfo(set, get),
  ...canvasGraphChanged(set),
  ...openDraggableDialog(set),
  ...openSnackbar(set),
  ...recentGraphs(set, get),
  ...subGraph(set, get),
  ...subgraphsStack(set, get),
  ...tasks(set),
  ...undoIndex(set, get),
  ...undoRedo(set, get),
  ...workingGraph(set, get),
  initializedGraph,
  initializedRFGraph,
}));

export default useStore;
