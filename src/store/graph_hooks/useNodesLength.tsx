import { useStore as useRFStore } from 'reactflow';

export default function useNodesLength() {
  return useRFStore((state) => [...state.nodeInternals.keys()].length);
}
