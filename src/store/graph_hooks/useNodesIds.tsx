import { useStore as useRFStore } from 'reactflow';

export default function useNodesIds() {
  return useRFStore((state) =>
    [...state.nodeInternals.values()].map((nod) => nod.id)
  );
}
