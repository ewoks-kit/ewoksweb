import type { Icon } from '../types';
import type { SetState } from 'zustand';
import type { State } from '../types';

interface AllIconsSlice {
  allIcons: Icon[];
  setAllIcons: (icons: Icon[]) => void;
}

const allIcons = (set: SetState<State>): AllIconsSlice => ({
  allIcons: [],

  setAllIcons: (icons: [Icon]) => {
    set((state) => ({
      ...state,
      allIcons: icons,
    }));
  },
});

export default allIcons;
