import { create } from 'zustand';

import type { State } from '../types';
import displayedWorkflowInfo from './displayedWorkflowInfo';
import rootWorkflow from './rootWorkflow';
import workflowIsChanged from './workflowIsChanged';

const useStore = create<State>((set, get) => ({
  ...displayedWorkflowInfo(set),
  ...rootWorkflow(set, get),
  ...workflowIsChanged(set),
}));

export default useStore;
