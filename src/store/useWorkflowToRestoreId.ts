import { create } from 'zustand';

interface State {
  id: string | undefined;
  setId: (id: string) => void;
  resetId: () => void;
}

const useWorkflowToRestoreId = create<State>((set) => ({
  id: import.meta.env.VITE_INITIAL_WORKFLOW_ID,
  setId: (id: string) => {
    console.log(id);

    set({
      id,
    });
  },
  resetId: () => set({ id: undefined }),
}));

export default useWorkflowToRestoreId;
