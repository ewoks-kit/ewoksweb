import create from 'zustand';
import { persist } from 'zustand/middleware';

export interface ConfigState {
  canvasBackgroundColor: string;
  setCanvasBackgroundColor: (color: string) => void;
}

const useConfigStore = create<ConfigState>(
  persist(
    (set) => ({
      canvasBackgroundColor: '#e9ebf7',
      setCanvasBackgroundColor: (canvasBackgroundColor: string) =>
        set({
          canvasBackgroundColor,
        }),
    }),
    {
      name: 'ewoksweb:config',
      version: 1,
    }
  )
);

export default useConfigStore;
