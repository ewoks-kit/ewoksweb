import create from 'zustand';
import type { EwoksRFLink, EwoksRFLinkData } from '../types';

export interface EdgeDataState {
  edgesData: Map<string, EwoksRFLinkData>;
  setEdgeData: (edgeId: string, edgeData: EwoksRFLinkData) => void;
  setEdgesData: (edges: EwoksRFLink[]) => void;
  resetEdgesData: () => void;
}

const useEdgeDataStore = create<EdgeDataState>((set) => ({
  edgesData: new Map(),

  setEdgeData: (edgeId, edgeData) => {
    set(({ edgesData }) => ({
      edgesData: new Map(edgesData).set(edgeId, edgeData),
    }));
  },
  setEdgesData: (edges) => {
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
