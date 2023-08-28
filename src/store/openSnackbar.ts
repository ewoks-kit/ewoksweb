import type { SnackbarParams, State } from '../types';
import type { SetState } from 'zustand';

export interface OpenSnackbarSlice {
  openSnackbar: SnackbarParams;
  setOpenSnackbar: (params: SnackbarParams) => void;
  showSuccessMsg: (text: string) => void;
  showWarningMsg: (text: string) => void;
  showErrorMsg: (text: string) => void;
  showInfoMsg: (text: string) => void;
}

const openSnackbar = (set: SetState<State>): OpenSnackbarSlice => ({
  openSnackbar: { open: false, text: '', severity: 'success' },

  setOpenSnackbar: (setOpen) => {
    set((state) => ({
      ...state,
      openSnackbar: setOpen,
    }));
  },

  showSuccessMsg: (text: string) => {
    set((state) => ({
      ...state,
      openSnackbar: {
        open: true,
        text,
        severity: 'success',
      },
    }));
  },

  showWarningMsg: (text: string) => {
    set((state) => ({
      ...state,
      openSnackbar: {
        open: true,
        text,
        severity: 'warning',
      },
    }));
  },

  showErrorMsg: (text: string) => {
    set((state) => ({
      ...state,
      openSnackbar: {
        open: true,
        text,
        severity: 'error',
      },
    }));
  },

  showInfoMsg: (text: string) => {
    set((state) => ({
      ...state,
      openSnackbar: {
        open: true,
        text,
        severity: 'info',
      },
    }));
  },
});

export default openSnackbar;
