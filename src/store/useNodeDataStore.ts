import create from 'zustand';
import type { EwoksRFNodeData } from '../types';

export interface NodeDataState {
  nodeData: Map<string, EwoksRFNodeData>;
  addNodeData: (nodeId: string, nodeData: EwoksRFNodeData) => void;
  resetNodesData: () => void;
}

const useNodeDataStore = create<NodeDataState>((set, get) => ({
  nodeData: new Map(),

  addNodeData: (nodeId, nodeData) => {
    set(() => ({
      nodeData: get().nodeData.set(nodeId, nodeData),
    }));
  },
  resetNodesData: () => {
    set(() => ({
      nodeData: new Map(),
    }));
  },
}));

export default useNodeDataStore;
