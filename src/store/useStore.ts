import create from 'zustand';
import type { State } from '../types';
import rootWorkflow from './rootWorkflow';
import loadedGraphs from './loadedGraphs';
import displayedWorkflowInfo from './displayedWorkflowInfo';

const useStore = create<State>((set, get) => ({
  ...displayedWorkflowInfo(set),
  ...loadedGraphs(set),
  ...rootWorkflow(set, get),
}));

export default useStore;
