import type { Color } from '@material-ui/lab';
import create from 'zustand';

interface SnackbarParams {
  open: boolean;
  text: string;
  severity: Color;
}

interface State {
  openSnackbar: SnackbarParams;
  showSuccessMsg: (text: string) => void;
  showWarningMsg: (text: string) => void;
  showErrorMsg: (text: string) => void;
  showInfoMsg: (text: string) => void;
  closeSnackbar: () => void;
}

const useSnackbarStore = create<State>((set) => ({
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
}));

export default useSnackbarStore;
