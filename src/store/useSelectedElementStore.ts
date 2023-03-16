import create from 'zustand';
import type { SelectedElement } from '../types';

export interface SelectedElementState {
  selectedElementNew: SelectedElement;
  setSelectedElementNew: (element: SelectedElement) => void;
}

const useSelectedElementStore = create<SelectedElementState>((set) => ({
  selectedElementNew: { type: 'graph', id: '' },

  setSelectedElementNew: (element) => {
    set(() => ({
      selectedElementNew: element,
    }));
  },
}));

export default useSelectedElementStore;
