import create from 'zustand';
import type { State } from '../types';
import workingGraph from './workingGraph';
import openDraggableDialog from './openDraggableDialog';
import openSnackbar from './openSnackbar';
import recentGraphs from './recentGraphs';
import subgraphsStack from './subgraphsStack';
import graphInfo from './graphInfo';

const useStore = create<State>((set, get) => ({
  ...graphInfo(set),
  ...openDraggableDialog(set),
  ...openSnackbar(set),
  ...recentGraphs(set, get),
  ...subgraphsStack(set, get),
  ...workingGraph(set, get),
}));

export default useStore;
