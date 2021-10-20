import create from 'zustand';
import type {
  State,
  EwoksRFLink,
  EwoksRFNode,
  GraphRF,
  GraphDetails,
  stackGraph,
} from './types';
import { toRFEwoksLinks, toRFEwoksNodes, getGraph } from './utils';

const nodes: EwoksRFNode[] = [];
const edges: EwoksRFLink[] = [];
console.log(nodes, edges);
// const positionedNodes = positionNodes(nodes, edges);
// console.log(positionedNodes);

// be clear on the different models I need to preserve
const useStore = create<State>((set, get) => ({
  recentGraphs: [] as GraphRF[],

  setRecentGraphs: (newGraph: GraphRF) => {
    console.log('NEW GRAPH:', get().recentGraphs, newGraph);
    const rec =
      get().recentGraphs.length > 0
        ? get().recentGraphs.filter((gr) => {
            console.log('GRR:', gr, newGraph);
            return gr.graph.id !== newGraph.graph.id;
          })
        : [];
    console.log('REC:', rec);
    set((state) => ({
      ...state,
      recentGraphs: [...rec, newGraph],
    }));
    console.log('RECENT GRAPHS:', get().recentGraphs);
  },

  graphOrSubgraph: true as Boolean,

  setGraphOrSubgraph: (isItGraph: Boolean) => {
    set((state) => ({
      ...state,
      graphOrSubgraph: isItGraph,
    }));
  },

  // stack has to hold name and id of graph
  subgraphsStack: [] as stackGraph[],

  setSubgraphsStack: (stackGraph: stackGraph) => {
    let stack = [];
    const subStack = get().subgraphsStack;
    const exists = subStack.map((gr) => gr.id).indexOf(stackGraph.id);
    console.log(exists, stackGraph);
    if (stackGraph.id === 'initialiase') {
      stack = [];
    } else if (exists === -1) {
      console.log('not exists');
      stack = [...subStack, stackGraph];
    } else if (exists == subStack.length - 1) {
      console.log('exists the last');
      stack = subStack;
    } else {
      console.log('exists');
      // subStack.length = exists + 1;
      stack = subStack.slice(0, exists + 1);
      // stack = ['graph'];
    }
    console.log(stack);
    set((state) => ({
      ...state,
      subgraphsStack: stack,
    }));
  },

  graphRF: { graph: {}, nodes: [], links: [] } as GraphRF,

  setGraphRF: (graphRF) => {
    console.log(graphRF);
    // if (get().graphOrSubgraph) {
    set((state) => ({
      ...state,
      graphRF,
    }));
    // } else {
    //   console.log(graphRF);
    // }
  },

  selectedElement: {
    id: '',
    type: '',
    data: { label: '' },
    position: { x: 0, y: 0 },
    default_inputs: [],
  } as EwoksRFNode,

  // sets graphRF as well? should it?
  setSelectedElement: (element: EwoksRFNode | EwoksRFLink | GraphDetails) => {
    console.log(element);
    if ('position' in element) {
      set((state) => ({
        ...state,
        graphRF: {
          graph: get().graphRF.graph,
          nodes: [
            ...get().graphRF.nodes.filter((nod) => nod.id !== element.id),
            element,
          ],
          links: get().graphRF.links,
        },
        selectedElement: element,
      }));
    } else if ('source' in element) {
      console.log('saving a link.');
      set((state) => ({
        ...state,
        graphRF: {
          graph: get().graphRF.graph,
          nodes: get().graphRF.nodes,
          links: [
            ...get().graphRF.links.filter((link) => link.id !== element.id),
            element,
          ],
        },
        selectedElement: element,
      }));
    } else {
      set((state) => ({
        ...state,
        graphRF: {
          graph: element,
          nodes: get().graphRF.nodes,
          links: get().graphRF.links,
        },
        selectedElement: element,
      }));
    }
  },

  selectedSubgraph: {
    graph: { id: '', name: '', input_nodes: [], output_nodes: [] },
    nodes: [],
    links: [],
  },

  setSelectedSubgraph: (graph: GraphRF) => {
    // get the subgraph from server?
    const graphRF = getGraph(graph.graph.id);
    console.log(graphRF);
    set((state) => ({
      ...state,
      selectedSubgraph: {
        graph: graphRF.graph,
        nodes: toRFEwoksNodes(graphRF.graph.id, get().recentGraphs),
        links: toRFEwoksLinks(graphRF.graph.id),
      },
    }));
  },
}));
export default useStore;
