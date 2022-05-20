// import type { Icons } from '../types';

const allIcons = (set) => ({
  allIcons: [],

  setAllIcons: (icons: [string]) => {
    console.log('set Icons names');
    set((state) => ({
      ...state,
      allIcons: icons,
    }));
  },
});

export default allIcons;
