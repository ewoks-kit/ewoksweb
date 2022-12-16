import type {
  EwoksRFLink,
  EwoksRFNode,
  GraphDetails,
  GraphRF,
  State,
} from '../types';
import type { GetState, SetState } from 'zustand';

export interface SelectedElementSlice {
  selectedElement?: EwoksRFNode | EwoksRFLink | GraphDetails;
  setSelectedElement?: (
    element: EwoksRFNode | EwoksRFLink | GraphDetails,
    from?: string,
    update?: boolean
  ) => void;
}

const selectedElement = (
  set: SetState<State>,
  get: GetState<State>
): SelectedElementSlice => ({
  selectedElement: {},

  setSelectedElement: (element, from) => {
    const wg = get().workingGraph.graph.id;
    const { graph, nodes, links } = get().graphRF;

    if (from === 'fromSaveElement') {
      get().setCanvasGraphChanged(true);
    }

    if (wg === '0' || wg === graph.id) {
      let tempGraph = {} as GraphRF;
      if ('position' in element) {
        const allOtherNodes = nodes.filter((nod) => nod.id !== element.id);
        tempGraph = {
          graph,
          nodes: [...initializeNodes(allOtherNodes), element],
          links: links.map((link) => {
            return { ...link, selected: false };
          }),
        };
        if (from === 'fromSaveElement') {
          get().setUndoRedo({
            action: 'Node details changed',
            graph: tempGraph,
          });
        }
      } else if ('source' in element) {
        tempGraph = {
          graph,
          // setting all node de-selected...
          nodes: initializeNodes(nodes),
          links: [...links.filter((link) => link.id !== element.id), element],
        };
        if (from === 'fromSaveElement') {
          get().setUndoRedo({
            action: 'Link details changed',
            graph: tempGraph,
          });
        }
      } else {
        tempGraph = {
          graph: element as GraphDetails,
          nodes: initializeNodes(nodes),
          links: links.map((link) => {
            return { ...link, selected: false }; // TODO: examine this after update
          }),
        };

        if (from === 'fromSaveElement') {
          get().setUndoRedo({
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

function initializeNodes(nodes) {
  return nodes.map((nod) => {
    return {
      ...nod,
      selected: false,
      data: { ...nod.data, details: false },
    };
  });
}

export default selectedElement;
