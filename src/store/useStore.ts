import create from 'zustand';
import type { State } from '../types';
import workingGraph from './workingGraph';
import openDraggableDialog from './openDraggableDialog';
import openSnackbar from './openSnackbar';
import rfWorkflows from './rfWorkflows';
import subgraphsStack from './subgraphsStack';
import graphInfo from './graphInfo';

const useStore = create<State>((set, get) => ({
  ...graphInfo(set),
  ...openDraggableDialog(set),
  ...openSnackbar(set),
  ...rfWorkflows(set, get),
  ...subgraphsStack(set, get),
  ...workingGraph(set, get),
}));

export default useStore;
