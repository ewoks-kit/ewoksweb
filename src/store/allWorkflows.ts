import type { workflowDescription } from '../types';

const allWorkflows = (set) => ({
  allWorkflows: [] as workflowDescription[],

  setAllWorkflows: (workflows: workflowDescription[]) => {
    console.log(workflows);
    set((state) => ({
      ...state,
      allWorkflows: workflows,
    }));
  },
});

export default allWorkflows;
