import { useStore as useRFStore } from 'reactflow';
import shallow from 'zustand/shallow';

export default function useNodesIds() {
  return useRFStore((state) => {
    return [...state.nodeInternals.keys()];
  }, shallow);
}
