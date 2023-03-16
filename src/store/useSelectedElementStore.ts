import create from 'zustand';
import type { SelectedElement } from '../types';

export interface SelectedElementState {
  selectedElement: SelectedElement;
  setSelectedElement: (element: SelectedElement) => void;
}

const useSelectedElementStore = create<SelectedElementState>((set) => ({
  selectedElement: { type: 'graph', id: '' },

  setSelectedElement: (element) => {
    set(() => ({
      selectedElement: element,
    }));
  },
}));

export default useSelectedElementStore;
