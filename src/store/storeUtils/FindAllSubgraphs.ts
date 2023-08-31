import type { GraphEwoks, GraphRF } from '../../types';
import { getSubgraphs } from '../../utils';

export async function findAllSubgraphs(
  graphToSearch: GraphEwoks,
  loadedGraphs: GraphRF[]
): Promise<GraphEwoks[]> {
  // TODO: examine functionality because it seems to get again previously
  // fetched graphs. Also goes one by one awaiting. Promise.all better??
  let subsToGet = [graphToSearch];
  const newNodeSubgraphs: GraphEwoks[] = [];

  const loadedGraphsIds = loadedGraphs.map((graph) => graph.graph.id);

  // Get for each graph all subgraphs it includes
  while (subsToGet.length > 0) {
    // Get for the first in subsToGet all subgraphs
    // eslint-disable-next-line no-await-in-loop
    const allGraphSubs: GraphEwoks[] = await getSubgraphs(
      subsToGet[0],
      loadedGraphsIds
    );
    // store them as ewoksGraphs for later transforming to RFGraphs
    allGraphSubs.forEach((gr) => {
      newNodeSubgraphs.push(gr);
      loadedGraphsIds.push(gr.graph.id);
    });
    // drop the one we searched for its subgraphs
    subsToGet.shift();
    // add the new subgraphs in the existing subgraphs we need to search
    subsToGet = [...subsToGet, ...allGraphSubs];
  }
  return newNodeSubgraphs;
}
