const allCategories = (set) => ({
  allCategories: [] as { label: string }[],

  setAllCategories: (categories: [{ label: string }]) => {
    // console.log(categories);
    set((state) => ({
      ...state,
      allCategories: categories,
    }));
  },
});

export default allCategories;
