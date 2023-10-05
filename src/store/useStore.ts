import { create } from 'zustand';

import type { State } from '../types';
import displayedWorkflowInfo from './displayedWorkflowInfo';
import loadedGraphs from './loadedGraphs';
import rootWorkflow from './rootWorkflow';

const useStore = create<State>((set, get) => ({
  ...displayedWorkflowInfo(set),
  ...loadedGraphs(set),
  ...rootWorkflow(set, get),
}));

export default useStore;
