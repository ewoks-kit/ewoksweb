import type { EwoksRFLink, EwoksRFNode, GraphDetails, State } from '../types';
import type { SetState } from 'zustand';
import useSelectedElementStore from './useSelectedElementStore';
import { isLink, isNode } from '../utils/typeGuards';

export interface SelectedElementSlice {
  selectedElement: EwoksRFNode | EwoksRFLink | GraphDetails;
  setSelectedElement: (
    element: EwoksRFNode | EwoksRFLink | GraphDetails
  ) => void;
}

const selectedElement = (set: SetState<State>): SelectedElementSlice => ({
  selectedElement: {} as GraphDetails,

  setSelectedElement: (element) => {
    useSelectedElementStore.getState().setSelectedElement({
      type: isNode(element) ? 'node' : isLink(element) ? 'edge' : 'graph',
      id: element.id,
    });
    set((state) => ({
      ...state,
      selectedElement: element,
    }));
  },
});

export default selectedElement;
