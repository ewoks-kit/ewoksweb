import { create } from 'zustand';

export interface FetchingWorkflowState {
  fetching: boolean;
  setFetching: (open: boolean) => void;
}

const useFetchingWorkflow = create<FetchingWorkflowState>((set) => ({
  fetching: false,
  setFetching: (fetching) => set({ fetching }),
}));

export default useFetchingWorkflow;
