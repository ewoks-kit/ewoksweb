import create from 'zustand';
import type { SidebarLayout } from '../types';
import { persist } from 'zustand/middleware';

export interface ConfigState {
  canvasBackgroundColor: string;
  setCanvasBackgroundColor: (color: string) => void;
  sidebarLayout: SidebarLayout;
  setSidebarLayout: (layout: SidebarLayout) => void;
}

const useConfigStore = create<ConfigState>(
  persist(
    (set) => ({
      canvasBackgroundColor: '#e9ebf7',
      setCanvasBackgroundColor: (canvasBackgroundColor: string) =>
        set({
          canvasBackgroundColor,
        }),
      sidebarLayout: 'grid' as SidebarLayout,
      setSidebarLayout: (sidebarLayout: SidebarLayout) => {
        set({ sidebarLayout });
      },
    }),
    {
      name: 'ewoksweb:config',
      version: 1,
    }
  )
);

export default useConfigStore;
