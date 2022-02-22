const tasks = (set, get) => ({
  tasks: [],
  setTasks: (tasks) => {
    set((state) => ({
      ...state,
      tasks,
    }));
  },
});

export default tasks;
