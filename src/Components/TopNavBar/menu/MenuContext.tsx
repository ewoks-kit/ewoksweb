import { createContext, useContext } from 'react';

interface MenuContextType {
  open: boolean;
  onClose: () => void;
}

export const MenuContext = createContext({} as MenuContextType);

export function useMenuContext() {
  return useContext(MenuContext);
}
