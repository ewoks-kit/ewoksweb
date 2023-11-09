import type { AlertColor } from '@mui/lab';
import { create } from 'zustand';

interface State {
  open: boolean;
  text: string;
  severity?: AlertColor;
  autoHideDuration: number;
  showSuccessMsg: (text: string, autoHideDuration?: number) => void;
  showWarningMsg: (text: string, autoHideDuration?: number) => void;
  showErrorMsg: (text: string, autoHideDuration?: number) => void;
  showInfoMsg: (text: string, autoHideDuration?: number) => void;
  closeSnackbar: () => void;
}

const useSnackbarStore = create<State>((set) => ({
  open: false,
  text: '',
  severity: undefined,
  autoHideDuration: 6000,

  showSuccessMsg: (text: string, autoHideDuration?: number) => {
    set((state) => ({
      ...state,
      open: true,
      text,
      severity: 'success',
      autoHideDuration: autoHideDuration || 6000,
    }));
  },

  showWarningMsg: (text: string, autoHideDuration?: number) => {
    set((state) => ({
      ...state,
      open: true,
      text,
      severity: 'warning',
      autoHideDuration: autoHideDuration || 6000,
    }));
  },

  showErrorMsg: (text: string, autoHideDuration?: number) => {
    set((state) => ({
      ...state,
      open: true,
      text,
      severity: 'error',
      autoHideDuration: autoHideDuration || 6000,
    }));
  },

  showInfoMsg: (text: string, autoHideDuration?: number) => {
    set((state) => ({
      ...state,
      open: true,
      text,
      severity: 'info',
      autoHideDuration: autoHideDuration || 6000,
    }));
  },

  closeSnackbar: () =>
    set((state) => ({
      ...state,
      open: false,
    })),
}));

export default useSnackbarStore;
