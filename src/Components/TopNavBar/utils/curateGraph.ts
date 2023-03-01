import type { EwoksRFLink, GraphDetails, GraphRF } from '../../../types';
import type { ReactFlowState } from 'reactflow';

function curateGraph(
  graphDetails: GraphDetails,
  stateRF: ReactFlowState
): GraphRF {
  const graphRFCurrated = { graph: graphDetails, ...stateRF };
  // INFO: change the workflow id when the label is changed
  // graphRFCurrated.graph.id = graphRFCurrated.graph.label;

  for (const nod of graphRFCurrated.getNodes()) {
    // INFO: Remove empty lines in table for nodes and links
    // TODO: removes only the last not all empty...
    const defaultInputs = nod.data.ewoks_props.default_inputs;
    const defaultErrorDataMapping =
      nod.data.ewoks_props.default_error_attributes?.data_mapping;

    if (
      defaultInputs &&
      defaultInputs.length > 0 &&
      defaultInputs[defaultInputs.length - 1].id === ''
    ) {
      defaultInputs.pop();
    }

    if (
      defaultErrorDataMapping &&
      defaultErrorDataMapping.length > 0 &&
      defaultErrorDataMapping[defaultErrorDataMapping.length - 1].id === ''
    ) {
      defaultErrorDataMapping.pop();
    }
  }
  for (const lin of graphRFCurrated.edges) {
    if (
      lin.data.conditions &&
      lin.data.conditions.length > 0 &&
      lin.data.conditions[lin.data.conditions.length - 1].id === ''
    ) {
      lin.data.conditions.pop();
    }
    if (
      lin.data.data_mapping &&
      lin.data.data_mapping.length > 0 &&
      lin.data.data_mapping[lin.data.data_mapping.length - 1].id === ''
    ) {
      lin.data.data_mapping.pop();
    }
  }

  // TBD: To be changed to return a new type
  return {
    graph: graphRFCurrated.graph,
    nodes: graphRFCurrated.getNodes(),
    links: (graphRFCurrated.edges as unknown) as EwoksRFLink[],
  };
}

export default curateGraph;
