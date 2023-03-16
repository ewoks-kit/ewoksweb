import create from 'zustand';
import type { selectedElementType } from '../types';

export interface SelectedElement {
  selectedElementNew: selectedElementType;
  setSelectedElementNew: (element: selectedElementType) => void;
}

const useSelectedElementStore = create<SelectedElement>((set) => ({
  selectedElementNew: { type: 'graph', id: '' },

  setSelectedElementNew: (element) => {
    set(() => ({
      selectedElementNew: element,
    }));
  },
}));

export default useSelectedElementStore;
