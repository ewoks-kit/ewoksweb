import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ConfigState {
  canvasBackgroundColor: string | undefined;
  setCanvasBackgroundColor: (color: string | undefined) => void;
}

const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      canvasBackgroundColor: undefined,
      setCanvasBackgroundColor: (canvasBackgroundColor: string | undefined) =>
        set({
          canvasBackgroundColor,
        }),
    }),
    {
      name: 'ewoksweb:config',
      version: 2,
    },
  ),
);

export default useConfigStore;
