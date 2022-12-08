import type { graphGeneralConfiguration } from '../types';

const graphGeneralConfig = (set) => ({
  graphGeneralConfig: { canvasBackgroundColor: '#e9ebf7' },

  setGraphGeneralConfig: (graphConfig: graphGeneralConfiguration) => {
    set((state) => ({
      ...state,
      graphGeneralConfig: graphConfig,
    }));
  },
});

export default graphGeneralConfig;
