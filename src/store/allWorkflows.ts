const allWorkflows = (set) => ({
  allWorkflows: [] as {
    id?: string;
    label?: string;
    category?: string;
  }[],

  setAllWorkflows: (
    workflows: [
      {
        id?: string;
        label?: string;
        category?: string;
      }
    ]
  ) => {
    set((state) => ({
      ...state,
      allWorkflows: workflows,
    }));
  },
});

export default allWorkflows;
