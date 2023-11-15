import type { AlertColor } from '@mui/lab';
import { create } from 'zustand';

interface State {
  open: boolean;
  text: string;
  severity?: AlertColor;
  autoHideDuration: number | undefined;
  showSuccessMsg: (text: string) => void;
  showWarningMsg: (text: string) => void;
  showErrorMsg: (text: string, autoHideDuration?: number) => void;
  showInfoMsg: (text: string) => void;
  closeSnackbar: () => void;
}

const useSnackbarStore = create<State>((set) => ({
  open: false,
  text: '',
  severity: undefined,
  autoHideDuration: undefined,

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

  showErrorMsg: (text: string, autoHideDuration?: number) => {
    set((state) => ({
      ...state,
      open: true,
      text,
      severity: 'error',
      autoHideDuration,
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
