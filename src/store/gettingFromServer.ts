import type { SetState } from 'zustand';
import type { State } from '../types';

export interface GettingFromServerSlice {
  gettingFromServer: boolean;
  setGettingFromServer: (val: boolean) => void;
}

const gettingFromServer = (set: SetState<State>): GettingFromServerSlice => ({
  gettingFromServer: false,

  setGettingFromServer: (val: boolean) => {
    set((state) => ({
      ...state,
      gettingFromServer: val,
    }));
  },
});

export default gettingFromServer;
