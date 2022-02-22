const allWorkflows = (set, get) => ({
  allWorkflows: [] as { title: string }[],

  setAllWorkflows: (workflows: [{ title: string }]) => {
    set((state) => ({
      ...state,
      allWorkflows: workflows,
    }));
  },
});

export default allWorkflows;
