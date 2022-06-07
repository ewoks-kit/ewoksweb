const allCategories = (set) => ({
  allCategories: [] as { title: string }[],

  setAllCategories: (categories: [{ title: string }]) => {
    console.log(categories);
    set((state) => ({
      ...state,
      allCategories: categories,
    }));
  },
});

export default allCategories;
