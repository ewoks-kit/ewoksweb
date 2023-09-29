import type { State, WorkflowDescription } from '../types';
import type { GetState, SetState } from 'zustand';

export interface SubgraphsStackSlice {
  subgraphsStack: WorkflowDescription[];
  setSubgraphsStack: (workflowDesc: WorkflowDescription) => void;
  resetSubgraphsStack: () => void;
}

const subgraphsStack = (
  set: SetState<State>,
  get: GetState<State>
): SubgraphsStackSlice => ({
  subgraphsStack: [],

  setSubgraphsStack: (workflowDesc) => {
    const oldStack = get().subgraphsStack;
    const workflowIndexInStack: number = oldStack
      .map((gr) => gr.id)
      .indexOf(workflowDesc.id);

    if (workflowIndexInStack === -1) {
      set({ subgraphsStack: [...oldStack, workflowDesc] });
      return;
    }

    if (workflowIndexInStack === oldStack.length - 1) {
      // TODO: if user insert the same 'graph' and is the first then stack is not updated
      // Not applicable so left as is and it just wont be able to doubleClick
      set({ subgraphsStack: oldStack });
      return;
    }

    set({ subgraphsStack: oldStack.slice(0, workflowIndexInStack + 1) });
  },

  resetSubgraphsStack: () => set({ subgraphsStack: [] }),
});

export default subgraphsStack;
