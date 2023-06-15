import type { SetState } from 'zustand';
import { DrawerTab } from '../types';
import type { State } from '../types';

export interface OpenSettingsDrawerSlice {
  openSettingsDrawer: DrawerTab;
  setOpenSettingsDrawer: (params: DrawerTab) => void;
}

const openSettingsDrawer = (set: SetState<State>): OpenSettingsDrawerSlice => ({
  openSettingsDrawer: DrawerTab.Closed,

  setOpenSettingsDrawer: (openTab) => {
    set((state) => ({
      ...state,
      openSettingsDrawer: openTab,
    }));
  },
});

export default openSettingsDrawer;
