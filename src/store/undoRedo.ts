import type { Action } from '../types';

const undoRedo = (set, get) => ({
  undoRedo: [] as Action[],

  setUndoRedo: (action: Action) => {
    console.log(action, get().undoIndex, get().undoRedo);
    // TODO: check the size of the history-array  not more than 10
    // when undo and then edit the steps above the current step are deleted
    set((state) => ({
      ...state,
      undoRedo: [
        ...get()
          .undoRedo.slice(-20)
          .slice(0, get().undoIndex + 1),
        action,
      ],
      undoIndex: get().undoIndex + 1,
    }));
  },

  undoIndex: 0 as number,

  setUndoIndex: (index) => {
    console.log(index, get().undoIndex, get().undoRedo);
    if (index >= 0 && get().undoRedo.length > index) {
      set((state) => ({
        ...state,
        undoIndex: index,
        graphRF: get().undoRedo[index].graph,
      }));
      // After setting the new GraphRF the selected element needs
      // to be updated to see the change in the sidebar again on undo-redo
      let selEl = get().selectedElement;
      if (selEl.id) {
        if ('position' in selEl) {
          selEl = get().undoRedo[index].graph.nodes.find(
            (nod) => nod.id === selEl.id
          );
          if (selEl) {
            get().setSelectedElement(selEl);
          }
        } else if ('source' in selEl) {
          selEl = get().undoRedo[index].graph.links.find(
            (lin) => lin.id === selEl.id
          );
          if (selEl) {
            get().setSelectedElement(selEl);
          }
        } else if ('output_nodes' in selEl) {
          get().setSelectedElement(get().undoRedo[index].graph.graph);
        }
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

export default undoRedo;
