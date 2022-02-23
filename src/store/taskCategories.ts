const taskCategories = (set) => ({
  taskCategories: ['Est', 'Dusk'],
  setTaskCategories: (taskCategories) => {
    set((state) => ({
      ...state,
      taskCategories: [...new Set(taskCategories)],
    }));
  },
});

export default taskCategories;
