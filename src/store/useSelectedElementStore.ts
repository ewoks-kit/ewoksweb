import create from 'zustand';

export interface SelectedElement {
  selectedElementNew: { type: 'graph' | 'node' | 'edge'; id: string };
  setSelectedElementNew: (element: {
    type: 'graph' | 'node' | 'edge';
    id: string;
  }) => void;
}

const useSelectedElementStore = create<SelectedElement>((set) => ({
  selectedElementNew: { type: 'graph', id: '' },

  setSelectedElementNew: (element) => {
    set((state) => ({
      ...state,
      selectedElementNew: element,
    }));
  },
}));

export default useSelectedElementStore;
