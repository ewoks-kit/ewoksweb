import type {
  Conditions,
  DataMapping,
  GraphDetails,
  GraphRF,
  Inputs,
  EwoksRFLink,
  EwoksRFNode,
} from '../../../types';
import type { ReactFlowState } from 'reactflow';

function curateGraph(
  graphDetails: GraphDetails,
  stateRF: ReactFlowState
): GraphRF {
  // INFO: Remove empty lines in table for nodes and links
  const nodes = [...stateRF.nodeInternals.values()].map((nodeRF) => {
    const node = nodeRF as EwoksRFNode;
    return {
      ...node,
      data: {
        ...node.data,
        ewoks_props: {
          ...node.data.ewoks_props,
          default_inputs: deleteEmptyLines(
            node.data.ewoks_props.default_inputs
          ),
          default_error_attributes: {
            ...node.data.ewoks_props.default_error_attributes,
            data_mapping: deleteEmptyLines(
              node.data.ewoks_props.default_error_attributes?.data_mapping
            ),
          },
        },
      },
    } as EwoksRFNode;
  });

  const links = [...stateRF.edges].map((edgeRF) => {
    const edge = edgeRF as EwoksRFLink;
    return {
      ...edge,
      data: {
        ...edge.data,
        conditions: deleteEmptyLines(edge.data.conditions),
        data_mapping: deleteEmptyLines(edge.data.data_mapping),
      },
    } as EwoksRFLink;
  });

  return {
    graph: graphDetails,
    nodes,
    links,
  };
}

function deleteEmptyLines(
  arrayObjId: DataMapping[] | Conditions[] | Inputs[] | undefined
) {
  if (arrayObjId && arrayObjId.length > 0) {
    // lodash filter seems to work
    // @ts-expect-error
    return arrayObjId.filter(
      (obj: DataMapping | Conditions | Inputs) => obj.id !== ''
    );
  }
  return [];
}

export default curateGraph;
