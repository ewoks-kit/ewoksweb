import type { GraphRF } from '../types';

const tutorialGraph = {
  graph: {
    id: 'newGraph',
    label: '',
    input_nodes: [],
    output_nodes: [],
    uiProps: {},
  },
  nodes: [],
  links: [],
} as GraphRF;

interface GraphRFStore {
  graphRF: GraphRF;
  setGraphRF: (graphRF: GraphRF, isChangeToCanvasGraph: boolean) => void;
}

const graphRF = (set, get): GraphRFStore => ({
  graphRF: tutorialGraph,

  setGraphRF: (graphRFL, isChangeToCanvasGraph) => {
    if (isChangeToCanvasGraph && !get().inExecutionMode) {
      get().setCanvasGraphChanged(true);
    }

    if (!isChangeToCanvasGraph) {
      get().setCanvasGraphChanged(false);
    }

    // If missing uiProps or other fill it here
    if (!graphRFL.graph.uiProps) {
      graphRFL.graph.uiProps = {};
    }
    set((state) => ({
      ...state,
      graphRF: graphRFL,
    }));
  },
});

export default graphRF;
