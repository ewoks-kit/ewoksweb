import create from 'zustand';

export interface TaskDrawerState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const useTaskDrawerState = create<TaskDrawerState>((set) => ({
  open: true,
  setOpen: (open) => set({ open }),
}));

export default useTaskDrawerState;
