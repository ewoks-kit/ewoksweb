import type { State } from '../types';
import type { GetState, SetState } from 'zustand';
// import useSelectedElementStore from './useSelectedElementStore';

export interface UndoIndexSlice {
  undoIndex: number;
  setUndoIndex: (index: number) => void;
}

const undoIndex = (
  set: SetState<State>,
  get: GetState<State>
): UndoIndexSlice => ({
  undoIndex: 0,

  setUndoIndex: (index) => {
    if (index >= 0 && get().undoRedo.length > index) {
      // This would have to set the RF Node through initWorkflow
      set((state) => ({
        ...state,
        undoIndex: index,
        graphRF: get().undoRedo[index].graph,
      }));
      // After setting the new GraphRF the selected element needs
      // to be updated to see the change in the sidebar again on undo-redo
      // const selEl = useSelectedElementStore.getState().selectedElement;

      // if (selEl.type === 'node') {
      //   const selElNode = get().undoRedo[index].graph.nodes.find(
      //     (nod) => nod.id === selEl.id
      //   );
      //   // This would have to set the RF Node through initWorkflow
      //   if (selElNode) {
      //     get().setSelectedElement(selElNode);
      //   }
      // }

      // if (selEl.type === 'edge') {
      //   const selElLink = get().undoRedo[index].graph.links.find(
      //     (lin) => lin.id === selEl.id
      //   );
      //   if (selElLink) {
      //     get().setSelectedElement(selElLink);
      //   }
      // }

      // if (selEl.type === 'graph') {
      //   get().setSelectedElement(get().undoRedo[index].graph.graph);
      // }
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
