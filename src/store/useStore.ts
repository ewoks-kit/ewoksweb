import { create } from 'zustand';

import type { State } from '../types';
import displayedWorkflowInfo from './displayedWorkflowInfo';
import rootWorkflow from './rootWorkflow';

const useStore = create<State>((set, get) => ({
  ...displayedWorkflowInfo(set),
  ...rootWorkflow(set, get),
}));

export default useStore;
