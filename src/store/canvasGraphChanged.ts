import type { SetState } from 'zustand';
import type { State } from '../types';

export interface CanvasGraphChangedSlice {
  canvasGraphChanged: boolean;
  setCanvasGraphChanged: (isChanged: boolean) => void;
}

const canvasGraphChanged = (set: SetState<State>): CanvasGraphChangedSlice => ({
  canvasGraphChanged: false,

  setCanvasGraphChanged: (isChanged) => {
    set((state) => ({
      ...state,
      canvasGraphChanged: isChanged,
    }));
  },
});

export default canvasGraphChanged;
