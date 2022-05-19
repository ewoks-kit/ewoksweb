// import type { Icons } from '../types';

const allIcons = (set) => ({
  allIcons: [],

  setAllIcons: (icons: [string]) => {
    set((state) => ({
      ...state,
      allIcons: icons,
    }));
  },
});

export default allIcons;
