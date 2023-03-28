import type {
  Conditions,
  DataMapping,
  GraphDetails,
  GraphRF,
  Inputs,
  EwoksRFLink,
  EwoksRFNode,
  EwoksRFNodeData,
  EwoksRFLinkData,
} from '../../../types';

function curateGraph(
  nodesData: Map<string, EwoksRFNodeData>,
  edgesData: Map<string, EwoksRFLinkData>
): {
  nodesData: Map<string, EwoksRFNodeData>;
  edgesData: Map<string, EwoksRFLinkData>;
} {
  // INFO: Remove empty lines in table for nodes and links
  const newNodesData: EwoksRFNodeData[] = [...nodesData.values()].map(
    (nodeData) => {
      return {
        ...nodeData,
        ewoks_props: {
          ...nodeData.ewoks_props,
          default_inputs: deleteEmptyLines(nodeData.ewoks_props.default_inputs),
          default_error_attributes: {
            ...nodeData.ewoks_props.default_error_attributes,
            data_mapping: deleteEmptyLines(
              nodeData.ewoks_props.default_error_attributes?.data_mapping
            ),
          },
        },
      };
    }
  );

  const newLinksData = stateRF.edges.map((edgeRF) => {
    const edge = edgeRF as EwoksRFLink;
    return {
      ...edge,
      data: {
        ...edge.data,
        conditions: deleteEmptyLines(edge.data.conditions),
        data_mapping: deleteEmptyLines(edge.data.data_mapping),
      },
    };
  });

  return {
    newNodesData,
    newLinksData,
  };
}

function deleteEmptyLines<T extends DataMapping | Conditions | Inputs>(
  arrayObjId: T[] | undefined
): T[] {
  if (!arrayObjId) {
    return [];
  }

  return arrayObjId.filter(
    (obj: DataMapping | Conditions | Inputs) => obj.id !== ''
  );
}

export default curateGraph;
