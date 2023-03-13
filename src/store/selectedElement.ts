import type { EwoksRFLink, EwoksRFNode, GraphDetails, State } from '../types';
import type { SetState } from 'zustand';

export interface SelectedElementSlice {
  selectedElement: EwoksRFNode | EwoksRFLink | GraphDetails;
  setSelectedElement: (
    element: EwoksRFNode | EwoksRFLink | GraphDetails
  ) => void;
}

const selectedElement = (set: SetState<State>): SelectedElementSlice => ({
  selectedElement: {} as GraphDetails,

  setSelectedElement: (element) => {
    set((state) => ({
      ...state,
      selectedElement: element,
    }));
  },
});

export default selectedElement;
