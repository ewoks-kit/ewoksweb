import type { SvgIcons } from '../types';

const allSvgIcons = (set) => ({
  allIcons: [],

  setAllSvgIcons: (icons: [SvgIcons]) => {
    console.log('set Icons names');
    set((state) => ({
      ...state,
      allIcons: icons,
    }));
  },
});

export default allSvgIcons;
