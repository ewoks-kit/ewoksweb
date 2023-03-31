import { useStore as useRFStore } from 'reactflow';
import useStore from 'store/useStore';
import shallow from 'zustand/shallow';
import type { EwoksRFLink, EwoksRFNode, GraphDetails } from '../types';
import useSelectedElementStore from './useSelectedElementStore';

export function useNodesIds() {
  return useRFStore((state) => {
    return [...state.nodeInternals.keys()];
  }, shallow);
}

export function useNodesLength() {
  return useRFStore((state) => [...state.nodeInternals.keys()].length);
}

export function useGraphId() {
  return useStore((state) => state.graphInfo.id);
}

export function useNode(id: string) {
  return useRFStore((state) => state.nodeInternals.get(id));
}

export function useEdge(id: string) {
  return useRFStore((state) => state.edges.find((edge) => edge.id === id));
}

export function useSelectedElement(): EwoksRFNode | EwoksRFLink | GraphDetails {
  const selectedElement = useSelectedElementStore(
    (state) => state.selectedElement
  );

  const nodeSelected = useNode(selectedElement.id) as EwoksRFNode;

  const edgeSelected = useEdge(selectedElement.id) as EwoksRFLink;

  const graph = useStore((state) => state.graphInfo);

  if (selectedElement.type === 'node') {
    return nodeSelected;
  }

  if (selectedElement.type === 'edge') {
    return edgeSelected;
  }

  return graph;
}
