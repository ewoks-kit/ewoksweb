import type { GraphEwoks, GraphRF } from '../types';
import { getSubgraphs } from '../utils';
// import { validateEwoksGraph } from './EwoksValidator';

export async function findAllSubgraphs(
  graphToSearch: GraphEwoks,
  recentGraphs: GraphRF[] | GraphEwoks[]
): Promise<GraphEwoks[]> {
  let subsToGet = [graphToSearch];
  const newNodeSubgraphs = [];

  const thisCallRecent = [...recentGraphs];

  // Get for each graph all subgraphs it includes
  while (subsToGet.length > 0) {
    // Get for the first in subsToGet all subgraphs
    // eslint-disable-next-line no-await-in-loop
    const allGraphSubs: GraphEwoks[] = await getSubgraphs(
      subsToGet[0],
      thisCallRecent as GraphRF[]
    );
    // store them as ewoksGraphs for later transforming to RFGraphs
    // .map((gra) => gra !== null)
    if (allGraphSubs.includes(null)) {
      subsToGet.shift();
    } else {
      allGraphSubs.forEach((gr) => {
        newNodeSubgraphs.push(gr);
        thisCallRecent.push(gr);
      });
      // drop the one we searched for its subgraphs
      subsToGet.shift();
      // add the new subgraphs in the existing subgraphs we need to search
      subsToGet = [...subsToGet, ...allGraphSubs];
      // validate the next graph to search for subgraphs
      // if (subsToGet.length > 0 && validateEwoksGraph(subsToGet[0])) {
      //   // console.log('validated:', subsToGet[0].graph.id);
      // } else if (subsToGet.length === 0) {
      //   // console.log('Finished ok');
      // } else {
      //   // console.log('NOT validated');
      // }
    }
  }
  return newNodeSubgraphs;
}
