import create from 'zustand';

export interface SelectedElement {
  selectedElement: { type: 'graph' | 'node' | 'edge'; id: string };
  setSelectedElement: (element: {
    type: 'graph' | 'node' | 'edge';
    id: string;
  }) => void;
}

const useSelectedElementStore = create<SelectedElement>((set) => ({
  selectedElement: { type: 'graph', id: '' },

  setSelectedElement: (element) => {
    console.log(element);

    set((state) => ({
      ...state,
      selectedElement: element,
    }));
  },
}));

export default useSelectedElementStore;
