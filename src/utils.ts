// @ts-ignore
// import dagre from 'dagre';
import type { EwoksRFNode, GraphEwoks, GraphRF } from './types';
import axios from 'axios';
import { calcGraphInputsOutputs } from './utils/CalcGraphInputsOutputs';
import { toEwoksLinks } from './utils/toEwoksLinks';
import { toEwoksNodes } from './utils/toEwoksNodes';
import { calcNoteNodes } from './utils/calcNoteNodes';

// const { GraphDagre } = dagre.graphlib;
// const NODE_SIZE = { width: 270, height: 36 };

export const ewoksNetwork = {};

export async function getWorkflows(): Promise<{ title: string }[]> {
  // const workflows = await axios.get('http://mxbes2-1707:38280/ewoks/workflows');
  // return workflows.data.workflows.map((work) => {
  const workflows = await axios
    .get('http://localhost:5000/workflows')
    .catch((error) => console.log(error));
  //
  if (workflows && workflows.data) {
    const workf = workflows.data as string[];
    return workf.map((work) => {
      return { title: work };
    });
  } else {
    return [];
  }
}

const id = 'graph';
export function createGraph() {
  // server returns the basic structure of a graph
  return {
    graph: {
      id: `${id}1`,
      label: 'newGraph',
      input_nodes: [],
      output_nodes: [],
    },
    nodes: [],
    links: [],
  };
}

export async function getSubgraphs(
  graph: GraphEwoks | GraphRF,
  recentGraphs: GraphRF[]
) {
  // TODO: need to load first layer subgraphs with failsave if some not found
  // Locate all subgraph nodes in the given graph
  const nodes: EwoksRFNode[] = [...graph.nodes];
  const existingNodeSubgraphs = nodes.filter(
    (nod) => nod.task_type === 'graph'
  );
  let results = [] as GraphEwoks[];
  if (existingNodeSubgraphs.length > 0) {
    // there are subgraphs -> first search in the recentGraphs for them
    const notInRecent = [];
    existingNodeSubgraphs.forEach((graph) => {
      if (
        recentGraphs.filter((gr) => gr.graph.id === graph.task_identifier)
          .length === 0
      ) {
        // add them in an array to request them from the server
        notInRecent.push(graph.task_identifier);
      }
    });
    // For those that are not in recent get them from the server
    results = await axios
      .all(
        notInRecent.map((id: string) =>
          axios.get(`http://localhost:5000/workflow/${id}`)
        )
      )
      .then(
        axios.spread((...res) => {
          // all requests are now complete in an array
          console.log(res);
          // if there is a null means the subgraph was not found
          // and it should show up in red
          const resCln = res.filter((result) => result.data !== null);
          return resCln.map((result) => result.data) as GraphEwoks[];
        })
      );
    // Uncomment
    // .catch((error) => {
    //   // remove after handling the error
    //   console.log('AXIOS ERROR', id, error);
    // });
  }
  console.log(results);
  return results ? results : [];
}

export function rfToEwoks(tempGraph): GraphEwoks {
  // calculate input_nodes-output_nodes nodes from graphInput-graphOutput
  const graph = calcGraphInputsOutputs(tempGraph);
  const noteNodes = calcNoteNodes(tempGraph);
  graph.uiProps.notes = noteNodes;
  return {
    graph,
    nodes: toEwoksNodes(tempGraph.nodes),
    links: toEwoksLinks(tempGraph.links),
  };
}

// function getNodeType(isSource: boolean, isTarget: boolean): string {
//   return isSource ? (isTarget ? 'internal' : 'input') : 'output';
// }

// export function positionNodes(nodes: Node[], edges: Edge[]): Node[] {
//   const graph = new GraphDagre();
//   graph.setDefaultEdgeLabel(() => ({}));
//   graph.setGraph({ rankdir: 'LR' });

//   const sourceNodes = new Set();
//   const targetNodes = new Set();

//   edges.forEach((e) => {
//     sourceNodes.add(e.source);
//     targetNodes.add(e.target);
//     graph.setEdge(e.source, e.target);
//   });

//   nodes.forEach((n) => graph.setNode(n.id, { ...NODE_SIZE }));

//   dagre.layout(graph);

//   return nodes.map<Node>((node) => {
//     const { id } = node;
//     const { x, y } = graph.node(id);

//     return {
//       ...node,
//       type: getNodeType(sourceNodes.has(id), targetNodes.has(id)),
//       position: {
//         x: x - NODE_SIZE.width / 2,
//         y: y - NODE_SIZE.height / 2,
//       },
//     };
//   });
// }
