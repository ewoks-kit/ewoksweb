import type { SetState } from 'zustand';
import type { State } from '../types';

// DOC: the number of the event we need to inspect on the sidebar

export interface CurrentExecutionEventSlice {
  currentExecutionEvent?: number;
  setCurrentExecutionEvent?: (index: number) => void;
}
const currentExecutionEvent = (
  set: SetState<State>
): CurrentExecutionEventSlice => ({
  currentExecutionEvent: 0,

  setCurrentExecutionEvent: (indexOfEvent) => {
    set((state) => ({
      ...state,
      currentExecutionEvent: indexOfEvent,
    }));
  },
});

export default currentExecutionEvent;
