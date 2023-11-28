import { merge } from 'lodash';
import { create } from 'zustand';

import useStore from '../store/useStore';
import type { NodeData, NodeWithData } from '../types';

export interface NodeDataState {
  nodesData: Map<string, NodeData>;
  setNodeData: (nodeId: string, nodeData: NodeData) => void;
  mergeNodeData: (nodeId: string, nodeData: Partial<NodeData>) => void;
  setNodesData: (nodesData: Map<string, NodeData>) => void;
  setDataFromNodes: (nodes: NodeWithData[]) => void;
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
    const { setWorkflowIsChanged } = useStore.getState();
    setWorkflowIsChanged(true);
    set(({ nodesData }) => {
      const newData: NodeData = merge({}, nodesData.get(nodeId), nodeData);

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
