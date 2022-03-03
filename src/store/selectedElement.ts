import type { EwoksRFLink, EwoksRFNode, GraphDetails, GraphRF } from '../types';

const selectedElement = (set, get) => ({
  selectedElement: {} as EwoksRFNode | EwoksRFLink | GraphDetails,

  setSelectedElement: (element, from) => {
    const prevState = get((prev) => prev);

    const wg = prevState.workingGraph.graph.id;
    const { graph, nodes, links } = prevState.graphRF;

    if (wg === '0' || wg === graph.id) {
      let tempGraph = {} as GraphRF;
      if ('position' in element) {
        tempGraph = {
          graph,
          nodes: [...nodes.filter((nod) => nod.id !== element.id), element],
          links,
        };
        if (from === 'fromSaveElement') {
          prevState.setUndoRedo({
            action: 'Node details changed',
            graph: tempGraph,
          });
        }
      } else if ('source' in element) {
        tempGraph = {
          graph,
          nodes,
          links: [...links.filter((link) => link.id !== element.id), element],
        };
        if (from === 'fromSaveElement') {
          prevState.setUndoRedo({
            action: 'Link details changed',
            graph: tempGraph,
          });
        }
      } else {
        tempGraph = {
          graph: element,
          nodes,
          links,
        };

        if (from === 'fromSaveElement') {
          prevState.setUndoRedo({
            action: 'Graph details changed',
            graph: tempGraph,
          });
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
