import graphGeneralConfig from './graphGeneralConfig';
import create from 'zustand';
import type { ConfigState } from '../types';

const useConfigStore = create<ConfigState>((set) => ({
  ...graphGeneralConfig(set),
}));

// @ts-expect-error
if (window.Cypress) {
  // @ts-expect-error
  window.__useConfigStore__ = useConfigStore;
}

export default useConfigStore;
