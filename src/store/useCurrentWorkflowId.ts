import create from 'zustand';

export interface CurrentWorkflowIdState {
  id: string | undefined;
  setId: (id: string) => void;
  resetId: () => void;
}

const useCurrentWorkflowIdStore = create<CurrentWorkflowIdState>((set) => ({
  id: process.env.REACT_APP_INITIAL_WORKFLOW_ID,
  setId: (id: string) =>
    set({
      id,
    }),
  resetId: () => set({ id: '' }),
}));

export default useCurrentWorkflowIdStore;
