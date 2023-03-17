import create from 'zustand';
import type { EwoksRFNodeData } from '../types';

export interface NodeDataState {
  nodesData: Map<string, EwoksRFNodeData>;
  setNodeData: (nodeId: string, nodeData: EwoksRFNodeData) => void;
  resetNodesData: () => void;
}

const useNodeDataStore = create<NodeDataState>((set, get) => ({
  nodesData: new Map(),

  setNodeData: (nodeId, nodeData) => {
    set(() => ({
      nodesData: get().nodesData.set(nodeId, nodeData),
    }));
  },
  resetNodesData: () => {
    set(() => ({
      nodesData: new Map(),
    }));
  },
}));

export default useNodeDataStore;
