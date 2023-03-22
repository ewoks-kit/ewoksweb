import create from 'zustand';
import type { EwoksRFNode, EwoksRFNodeData } from '../types';
// import { merge } from 'lodash';

export interface NodeDataState {
  nodesData: Map<string, EwoksRFNodeData>;
  setNodeData: (nodeId: string, nodeData: EwoksRFNodeData) => void;
  // mergeNodeData: (nodeId: string, nodeData: EwoksRFNodeData) => void;
  setNodesData: (nodes: EwoksRFNode[]) => void;
  resetNodesData: () => void;
}

const useNodeDataStore = create<NodeDataState>((set) => ({
  nodesData: new Map(),

  setNodeData: (nodeId, nodeData) => {
    set(({ nodesData }) => ({
      nodesData: new Map(nodesData).set(nodeId, nodeData),
    }));
  },
  // TBD
  // mergeNodeData: (nodeId, nodeData) => {
  //   const newData: EwoksRFNodeData = merge(
  //     get().nodesData.get(nodeId),
  //     nodeData
  //   );

  //   set(({ nodesData }) => ({
  //     nodesData: new Map(nodesData).set(nodeId, newData),
  //   }));
  // },
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
