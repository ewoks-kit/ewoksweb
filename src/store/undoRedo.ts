import type { Action } from '../types';

const undoRedo = (set, get) => ({
  undoRedo: [] as Action[],

  setUndoRedo: (action: Action) => {
    set((state) => ({
      ...state,
      undoRedo: [
        ...get()
          .undoRedo.slice(-20)
          .slice(0, (get().undoIndex as number) + 1),
        action,
      ],
      undoIndex: (get().undoIndex as number) + 1,
    }));
  },
});

export default undoRedo;
