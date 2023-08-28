import create from 'zustand';
import type { State } from '../types';
import rootWorkflow from './rootWorkflow';
import openDraggableDialog from './openDraggableDialog';
import openSnackbar from './openSnackbar';
import recentGraphs from './recentGraphs';
import subGraph from './subGraph';
import subgraphsStack from './subgraphsStack';
import graphInfo from './graphInfo';

const useStore = create<State>((set, get) => ({
  ...graphInfo(set),
  ...openDraggableDialog(set),
  ...openSnackbar(set),
  ...recentGraphs(set, get),
  ...subGraph(set, get),
  ...subgraphsStack(set, get),
  ...rootWorkflow(set, get),
}));

export default useStore;
