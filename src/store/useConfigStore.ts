import create from 'zustand';

export interface ConfigState {
  canvasBackgroundColor: string;
  setCanvasBackgroundColor: (color: string) => void;
  showAdvancedDetails: boolean;
  setShowAdvancedDetails: (advanced: boolean) => void;
}

const useConfigStore = create<ConfigState>((set) => ({
  canvasBackgroundColor: '#e9ebf7',
  setCanvasBackgroundColor: (canvasBackgroundColor: string) =>
    set({
      canvasBackgroundColor,
    }),

  showAdvancedDetails: false,
  setShowAdvancedDetails: (showAdvancedDetails) =>
    set({
      showAdvancedDetails,
    }),
}));

export default useConfigStore;
