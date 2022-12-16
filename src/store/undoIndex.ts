import type { State } from '../types';
import type { GetState, SetState } from 'zustand';

export interface UndoIndexSlice {
  undoIndex?: number;
  setUndoIndex?: (index: number) => void;
}

const undoIndex = (
  set: SetState<State>,
  get: GetState<State>
): UndoIndexSlice => ({
  undoIndex: 0,

  setUndoIndex: (index) => {
    if (index >= 0 && get().undoRedo.length > index) {
      set((state) => ({
        ...state,
        undoIndex: index,
        graphRF: get().undoRedo[index].graph,
      }));
      // After setting the new GraphRF the selected element needs
      // to be updated to see the change in the sidebar again on undo-redo
      let selEl = get().selectedElement;

      if ('position' in selEl) {
        selEl = get().undoRedo[index].graph.nodes.find(
          (nod) => nod.id === selEl.id
        );
        if (selEl) {
          get().setSelectedElement(selEl);
        }
      }

      if ('source' in selEl) {
        selEl = get().undoRedo[index].graph.links.find(
          (lin) => lin.id === selEl.id
        );
        if (selEl) {
          get().setSelectedElement(selEl);
        }
      }

      if ('output_nodes' in selEl) {
        get().setSelectedElement(get().undoRedo[index].graph.graph);
      }
    } else {
      get().setOpenSnackbar({
        open: true,
        text: 'No more back or forth!',
        severity: 'warning',
      });
    }
  },
});

export default undoIndex;
