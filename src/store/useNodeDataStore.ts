import create from 'zustand';
import type { EwoksRFNode, EwoksRFNodeData } from '../types';
import { merge } from 'lodash';

export interface NodeDataState {
  nodesData: Map<string, EwoksRFNodeData>;
  setNodeData: (nodeId: string, nodeData: EwoksRFNodeData) => void;
  mergeNodeData: (nodeId: string, nodeData: EwoksRFNodeData) => void;
  setNodesData: (nodes: EwoksRFNode[]) => void;
  resetNodesData: () => void;
}

const useNodeDataStore = create<NodeDataState>((set, get) => ({
  nodesData: new Map(),

  setNodeData: (nodeId, nodeData) => {
    set(({ nodesData }) => ({
      nodesData: new Map(nodesData).set(nodeId, nodeData),
    }));
  },
  mergeNodeData: (nodeId, nodeData) => {
    set(({ nodesData }) => {
      const newData: EwoksRFNodeData = merge(nodesData.get(nodeId), nodeData);

      // TBD if newData is not spread it is not working!!!
      return {
        nodesData: new Map(nodesData).set(nodeId, { ...newData }),
      };
    });
  },
  setNodesData: (nodes) => {
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
