import type { Action, State } from '../types';
import type { GetState, SetState } from 'zustand';

export interface UndoRedoSlice {
  undoRedo: Action[];
  setUndoRedo: (action: Action) => void;
}
const undoRedo = (
  set: SetState<State>,
  get: GetState<State>
): UndoRedoSlice => ({
  undoRedo: [],

  setUndoRedo: (action: Action) => {
    set((state) => ({
      ...state,
      undoRedo: [
        ...get()
          .undoRedo.slice(-20)
          .slice(0, get().undoIndex + 1),
        action,
      ],
      undoIndex: get().undoIndex + 1,
    }));
  },
});

export default undoRedo;
