import type { SnackbarParams, State } from '../types';
import type { SetState } from 'zustand';

export interface OpenSnackbarSlice {
  openSnackbar: SnackbarParams;
  showSuccessMsg: (text: string) => void;
  showWarningMsg: (text: string) => void;
  showErrorMsg: (text: string) => void;
  showInfoMsg: (text: string) => void;
  closeSnackbar: () => void;
}

const openSnackbar = (set: SetState<State>): OpenSnackbarSlice => ({
  openSnackbar: { open: false, text: '', severity: 'success' },

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

  closeSnackbar: () =>
    set((state) => ({
      ...state,
      openSnackbar: { open: false, text: '', severity: 'success' },
    })),
});

export default openSnackbar;
