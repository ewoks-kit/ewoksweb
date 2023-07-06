import create from 'zustand';

export interface NavBarElementState {
  element: HTMLElement | undefined;
  setElement: (element: HTMLElement | undefined) => void;
}

const useNavBarElementStore = create<NavBarElementState>((set) => ({
  element: undefined,
  setElement: (element: HTMLElement | undefined) =>
    set({
      element,
    }),
}));

export default useNavBarElementStore;
