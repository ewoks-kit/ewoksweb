const allCategories = (set) => ({
  allCategories: [] as { title: string }[],

  setAllCategories: (categories: [{ title: string }]) => {
    set((state) => ({
      ...state,
      allCategories: categories,
    }));
  },
});

export default allCategories;
