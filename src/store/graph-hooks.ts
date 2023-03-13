import { useStore as useRFStore } from 'reactflow';
import useStore from 'store/useStore';
import shallow from 'zustand/shallow';
import type { selectedElementType } from '../types';

export function useNodesIds() {
  return useRFStore((state) => {
    return [...state.nodeInternals.keys()];
  }, shallow);
}

export function useNodesLength() {
  return useRFStore((state) => [...state.nodeInternals.keys()].length);
}

export function useGraphId() {
  return useStore((state) => state.graphRFDetails.id);
}

export function useNode(id: string) {
  return useRFStore((state) => state.nodeInternals.get(id));
}

export function useEdge(id: string) {
  return useRFStore((state) => state.edges.find((edge) => edge.id === id));
}

// export function useSelectedElement(selected: selectedElementType) {
//   return
//     selectedElementNew.type === 'node'
//       ? getNodes().find((node) => node.id === selectedElementNew.id)
//       : selectedElementNew.type === 'edge'
//       ? getEdges().find((edge) => edge.id === selectedElementNew.id)
//       : graphRFDetails;
// }
