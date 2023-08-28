import create from 'zustand';
import type { State } from '../types';
import workingGraph from './workingGraph';
import openDraggableDialog from './openDraggableDialog';
import openSnackbar from './openSnackbar';
import recentGraphs from './recentGraphs';
import subGraph from './subGraph';
import subgraphsStack from './subgraphsStack';
import displayedWorkflowInfo from './displayedWorkflowInfo';

const useStore = create<State>((set, get) => ({
  ...displayedWorkflowInfo(set),
  ...openDraggableDialog(set),
  ...openSnackbar(set),
  ...recentGraphs(set, get),
  ...subGraph(set, get),
  ...subgraphsStack(set, get),
  ...workingGraph(set, get),
}));

export default useStore;
