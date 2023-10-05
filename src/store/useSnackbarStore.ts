import type { Color } from '@material-ui/lab';
import { create } from 'zustand';

interface State {
  open: boolean;
  text: string;
  severity?: Color;
  showSuccessMsg: (text: string) => void;
  showWarningMsg: (text: string) => void;
  showErrorMsg: (text: string) => void;
  showInfoMsg: (text: string) => void;
  closeSnackbar: () => void;
}

const useSnackbarStore = create<State>((set) => ({
  open: false,
  text: '',
  severity: undefined,

  showSuccessMsg: (text: string) => {
    set((state) => ({
      ...state,
      open: true,
      text,
      severity: 'success',
    }));
  },

  showWarningMsg: (text: string) => {
    set((state) => ({
      ...state,
      open: true,
      text,
      severity: 'warning',
    }));
  },

  showErrorMsg: (text: string) => {
    set((state) => ({
      ...state,
      open: true,
      text,
      severity: 'error',
    }));
  },

  showInfoMsg: (text: string) => {
    set((state) => ({
      ...state,
      open: true,
      text,
      severity: 'info',
    }));
  },

  closeSnackbar: () =>
    set((state) => ({
      ...state,
      open: false,
    })),
}));

export default useSnackbarStore;
