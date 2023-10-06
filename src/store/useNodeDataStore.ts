import { merge } from 'lodash';
import { create } from 'zustand';

import type { EwoksRFNode, EwoksRFNodeData } from '../types';

export interface NodeDataState {
  nodesData: Map<string, EwoksRFNodeData>;
  setNodeData: (nodeId: string, nodeData: EwoksRFNodeData) => void;
  mergeNodeData: (nodeId: string, nodeData: Partial<EwoksRFNodeData>) => void;
  setNodesData: (nodesData: Map<string, EwoksRFNodeData>) => void;
  setDataFromNodes: (nodes: EwoksRFNode[]) => void;
  resetNodesData: () => void;
}

const useNodeDataStore = create<NodeDataState>((set) => ({
  nodesData: new Map(),

  setNodeData: (nodeId, nodeData) => {
    set(({ nodesData }) => ({
      nodesData: new Map(nodesData).set(nodeId, nodeData),
    }));
  },

  mergeNodeData: (nodeId, nodeData) => {
    set(({ nodesData }) => {
      const newData: EwoksRFNodeData = merge(
        {},
        nodesData.get(nodeId),
        nodeData,
      );

      return {
        nodesData: new Map(nodesData).set(nodeId, { ...newData }),
      };
    });
  },
  setNodesData: (nodesData) => set({ nodesData }),
  setDataFromNodes: (nodes) => {
    set(() => ({
      nodesData: new Map(nodes.map((nod) => [nod.id, nod.data])),
    }));
  },
  resetNodesData: () => {
    set(() => ({
      nodesData: new Map(),
    }));
  },
}));

export default useNodeDataStore;
