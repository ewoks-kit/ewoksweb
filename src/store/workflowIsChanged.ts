import type { SetState } from 'zustand';

import type { State } from '../types';

export interface WorkflowIsChangedSlice {
  workflowIsChanged: boolean;
  setWorkflowIsChanged: (isChanged: boolean) => void;
}

const workflowIsChanged = (set: SetState<State>): WorkflowIsChangedSlice => ({
  workflowIsChanged: false,

  setWorkflowIsChanged: (isChanged: boolean) => {
    console.log(isChanged);

    set((state: State) => ({ ...state, workflowIsChanged: isChanged }));
  },
});

export default workflowIsChanged;
