import { useStore as useRFStore } from 'reactflow';
import shallow from 'zustand/shallow';

export function useNodesIds() {
  return useRFStore((state) => {
    return [...state.nodeInternals.keys()];
  }, shallow);
}

export function useNodesLength() {
  return useRFStore((state) => [...state.nodeInternals.keys()].length);
}
