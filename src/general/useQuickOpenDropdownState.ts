import { create } from 'zustand';

import type { ElementState } from '../types';

const useQuickOpenDropdownState = create<ElementState>((set) => ({
  element: undefined,
  setElement: (element: HTMLElement | undefined) =>
    set({
      element,
    }),
}));

export default useQuickOpenDropdownState;
