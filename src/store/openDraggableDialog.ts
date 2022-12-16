import type { DialogParams, State } from '../types';
import type { SetState } from 'zustand';

export interface OpenDraggableDialogSlice {
  openDraggableDialog?: DialogParams;
  setOpenDraggableDialog?: (params: DialogParams) => void;
}

// DOC: use it if draggable dialog needs to open by many places
const openDraggableDialog = (
  set: SetState<State>
): OpenDraggableDialogSlice => ({
  openDraggableDialog: { open: false, content: {} },

  setOpenDraggableDialog: ({ open, content }) => {
    set((state) => ({
      ...state,
      openDraggableDialog: { open, content },
    }));
  },
});

export default openDraggableDialog;
