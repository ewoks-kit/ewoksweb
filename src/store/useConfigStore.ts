import create from 'zustand';

export interface ConfigState {
  canvasBackgroundColor: string;
  setCanvasBackgroundColor: (color: string) => void;
}

const useConfigStore = create<ConfigState>((set) => ({
  canvasBackgroundColor: 'pink',
  setCanvasBackgroundColor: (canvasBackgroundColor: string) =>
    set({
      canvasBackgroundColor,
    }),
}));

export default useConfigStore;
