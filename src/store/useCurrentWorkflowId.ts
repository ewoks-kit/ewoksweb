import create from 'zustand';

export interface CurrentWorkflowIdState {
  id: string | undefined;
  workingGraphSource: string | undefined;
  setId: (id: string, workingGraphSource?: string) => void;
  resetId: () => void;
}

const useCurrentWorkflowIdStore = create<CurrentWorkflowIdState>((set) => ({
  id: process.env.REACT_APP_INITIAL_WORKFLOW_ID,
  workingGraphSource: undefined,
  setId: (id: string, workingGraphSource?: string) =>
    set({
      id,
      workingGraphSource,
    }),
  resetId: () => set({ id: '', workingGraphSource: undefined }),
}));

export default useCurrentWorkflowIdStore;
