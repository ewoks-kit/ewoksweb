import type { workflowDescription } from '../types';

const allWorkflows = (set) => ({
  allWorkflows: [] as workflowDescription[],

  setAllWorkflows: (workflows: workflowDescription[]) => {
    set((state) => ({
      ...state,
      allWorkflows: workflows,
    }));
  },
});

export default allWorkflows;
