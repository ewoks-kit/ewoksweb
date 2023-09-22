import create from 'zustand';
import type { EwoksRFLink, EwoksRFLinkData } from '../types';
import { merge } from 'lodash';

export interface EdgeDataState {
  edgesData: Map<string, EwoksRFLinkData>;
  setEdgeData: (edgeId: string, edgeData: EwoksRFLinkData) => void;
  mergeEdgeData: (edgeId: string, edgeData: Partial<EwoksRFLinkData>) => void;
  setEdgesData: (edgesData: Map<string, EwoksRFLinkData>) => void;
  setDataFromEdges: (edges: EwoksRFLink[]) => void;
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
      const newData: EwoksRFLinkData = merge(
        {},
        edgesData.get(edgeId),
        edgeData
      );

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
