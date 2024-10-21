import type { Edge, Node, ReactFlowState } from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';
import { useStore as useRFStore } from '@xyflow/react';
import { shallow } from 'zustand/shallow';

import useWorkflowHistory from './useWorkflowHistory';

export function useNodesIds() {
  return useRFStore((state) => [...state.nodeLookup.keys()], shallow);
}

export function useNodesLength() {
  return useRFStore((state) => state.nodes.length);
}

export function useNode(id: string) {
  const { getNode } = useReactFlow();
  return getNode(id);
}

export function useEdge(id: string) {
  const { getEdge } = useReactFlow();
  return getEdge(id);
}

export function useSelectedElement(): Node | Edge | undefined {
  return useRFStore(nodeEdgeSelectedSelector);
}

const nodeEdgeSelectedSelector = (state: ReactFlowState) => {
  const nodeSelected = state.nodes.find((node) => node.selected);
  if (nodeSelected) {
    return nodeSelected;
  }
  const edgeSelected = state.edges.find((edge) => edge.selected);
  if (edgeSelected) {
    return edgeSelected;
  }
  return undefined;
};

export function useWorkflowHasChanges(): boolean {
  return useWorkflowHistory((state) => state.workflowHistory.length > 1);
}
