import create from 'zustand';
import type { State } from '../types';
import workingGraph from './workingGraph';
import openDraggableDialog from './openDraggableDialog';
import openSnackbar from './openSnackbar';
import recentGraphs from './recentGraphs';
import subGraph from './subGraph';
import subgraphsStack from './subgraphsStack';
import tasks from './tasks';
import {
  initializedGraph,
  initializedRFGraph,
} from '../utils/InitializedEntities';
import graphInfo from './graphInfo';

const useStore = create<State>((set, get) => ({
  ...graphInfo(set),
  ...openDraggableDialog(set),
  ...openSnackbar(set),
  ...recentGraphs(set, get),
  ...subGraph(set, get),
  ...subgraphsStack(set, get),
  ...tasks(set),
  ...workingGraph(set, get),
  initializedGraph,
  initializedRFGraph,
}));

export default useStore;
