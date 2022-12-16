import type { SetState } from 'zustand';
import type { State } from '../types';

export interface OpenSettingsDrawerSlice {
  openSettingsDrawer?: string;
  setOpenSettingsDrawer?: (params: string) => void;
}

const openSettingsDrawer = (set: SetState<State>): OpenSettingsDrawerSlice => ({
  openSettingsDrawer: '',

  setOpenSettingsDrawer: (openTab) => {
    set((state) => ({
      ...state,
      openSettingsDrawer: openTab,
    }));
  },
});

export default openSettingsDrawer;
