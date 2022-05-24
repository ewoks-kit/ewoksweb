// import type { Icons } from '../types';

const allIconNames = (set) => ({
  allIconNames: [],

  setAllIconNames: (icons: [string]) => {
    console.log('set Icons names');
    set((state) => ({
      ...state,
      allIconNames: icons,
    }));
  },
});

export default allIconNames;
