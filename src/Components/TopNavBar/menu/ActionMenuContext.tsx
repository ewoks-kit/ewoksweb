import { createContext, useContext } from 'react';

interface MenuContextType {
  open: boolean;
  onClose: () => void;
}

export const ActionMenuContext = createContext({} as MenuContextType);

export function useActionMenuContext() {
  return useContext(ActionMenuContext);
}
