import { merge } from 'lodash';
import { create } from 'zustand';

import type { LinkData, LinkWithData } from '../types';

export interface EdgeDataState {
  edgesData: Map<string, LinkData>;
  setEdgeData: (edgeId: string, edgeData: LinkData) => void;
  mergeEdgeData: (edgeId: string, edgeData: Partial<LinkData>) => void;
  setEdgesData: (edgesData: Map<string, LinkData>) => void;
  setDataFromEdges: (edges: LinkWithData[]) => void;
  resetEdgesData: () => void;
}

const useEdgeDataStore = create<EdgeDataState>((set) => ({
  edgesData: new Map(),

  setEdgeData: (edgeId, edgeData) => {
    set(({ edgesData }) => ({
      edgesData: new Map(edgesData).set(edgeId, edgeData),
    }));
  },
  mergeEdgeData: (edgeId, edgeData) => {
    set(({ edgesData }) => {
      const newData: LinkData = merge({}, edgesData.get(edgeId), edgeData);

      return {
        edgesData: new Map(edgesData).set(edgeId, { ...newData }),
      };
    });
  },
  setEdgesData: (edgesData) => set({ edgesData }),
  setDataFromEdges: (edges) => {
    set(() => ({
      edgesData: new Map(edges.map((edg) => [edg.id, edg.data])),
    }));
  },
  resetEdgesData: () => {
    set(() => ({
      edgesData: new Map(),
    }));
  },
}));

export default useEdgeDataStore;
