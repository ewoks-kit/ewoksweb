import type { SnackbarParams, State } from '../types';
import type { SetState } from 'zustand';

export interface OpenSnackbarSlice {
  openSnackbar: SnackbarParams;
  setOpenSnackbar: (params: SnackbarParams) => void;
}

const openSnackbar = (set: SetState<State>): OpenSnackbarSlice => ({
  openSnackbar: { open: false, text: '', severity: 'success' },

  setOpenSnackbar: (setOpen) => {
    set((state) => ({
      ...state,
      openSnackbar: setOpen,
    }));
  },
});

export default openSnackbar;
