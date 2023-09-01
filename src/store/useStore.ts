import create from 'zustand';
import type { State } from '../types';
import rootWorkflow from './rootWorkflow';
import openDraggableDialog from './openDraggableDialog';
import loadedGraphs from './loadedGraphs';
import subgraphsStack from './subgraphsStack';
import displayedWorkflowInfo from './displayedWorkflowInfo';

const useStore = create<State>((set, get) => ({
  ...displayedWorkflowInfo(set),
  ...openDraggableDialog(set),
  ...loadedGraphs(set),
  ...subgraphsStack(set, get),
  ...rootWorkflow(set, get),
}));

export default useStore;
