import type { EwoksRFLink, EwoksRFNode, GraphDetails, GraphRF } from '../types';
import state from './state';

const selectedElement = (set, get) => ({
  selectedElement: {} as EwoksRFNode | EwoksRFLink | GraphDetails,

  setSelectedElement: (element, from) => {
    console.log(element, from, state);
    const wg = state.workingGraph.graph.id;
    const { graph, nodes, links } = get().graphRF;

    if (wg === '0' || wg === graph.id) {
      let tempGraph = {} as GraphRF;
      if ('position' in element) {
        tempGraph = {
          graph,
          nodes: [...nodes.filter((nod) => nod.id !== element.id), element],
          links,
        };
        if (from === 'fromSaveElement') {
          get().setUndoRedo({
            action: 'Node details changed',
            graph: tempGraph,
          });
          // get().setUndoIndex(get().undoIndex + 1);
        }
      } else if ('source' in element) {
        tempGraph = {
          graph,
          nodes,
          links: [...links.filter((link) => link.id !== element.id), element],
        };
        if (from === 'fromSaveElement') {
          get().setUndoRedo({
            action: 'Link details changed',
            graph: tempGraph,
          });
          // get().setUndoIndex(get().undoIndex + 1);
        }
      } else {
        tempGraph = {
          graph: element,
          nodes,
          links,
        };

        if (from === 'fromSaveElement') {
          get().setUndoRedo({
            action: 'Graph details changed',
            graph: tempGraph,
          });
          // get().setUndoIndex(get().undoIndex + 1);
        }
      }
      set((state) => ({
        ...state,
        graphRF: tempGraph,
        selectedElement: element,
      }));
    } else {
      set((state) => ({
        ...state,
        selectedElement: element,
      }));
    }
  },
});

export default selectedElement;
