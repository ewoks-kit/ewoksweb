import type { Icon } from '../types';

const allIcons = (set) => ({
  allIcons: [],

  setAllIcons: (icons: [Icon]) => {
    console.log('set Icons names');
    set((state) => ({
      ...state,
      allIcons: icons,
    }));
  },
});

export default allIcons;
