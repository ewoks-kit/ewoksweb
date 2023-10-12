import type { Edge, Node, ReactFlowState } from 'reactflow';
import { useStore as useRFStore } from 'reactflow';
import { shallow } from 'zustand/shallow';

export function useNodesIds() {
  return useRFStore((state) => {
    return [...state.nodeInternals.keys()];
  }, shallow);
}

export function useNodesLength() {
  return useRFStore((state) => [...state.nodeInternals.keys()].length);
}

export function useNode(id: string) {
  return useRFStore((state) => state.nodeInternals.get(id));
}

export function useEdge(id: string) {
  return useRFStore((state) => state.edges.find((edge) => edge.id === id));
}

export function useSelectedElement(): Node | Edge | undefined {
  return useRFStore(nodeEdgeSelectedSelector);
}

const nodeEdgeSelectedSelector = (state: ReactFlowState) => {
  const nodeSelected = [...state.nodeInternals.values()].find(
    (node) => node.selected,
  );
  if (nodeSelected) {
    return nodeSelected;
  }
  const edgeSelected = [...state.edges.values()].find((edge) => edge.selected);
  if (edgeSelected) {
    return edgeSelected;
  }
  return undefined;
};
