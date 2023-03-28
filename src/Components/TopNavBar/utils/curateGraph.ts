import type {
  Conditions,
  DataMapping,
  Inputs,
  EwoksRFNodeData,
  EwoksRFLinkData,
} from '../../../types';

function curateGraph(
  nodesData: Map<string, EwoksRFNodeData>,
  edgesData: Map<string, EwoksRFLinkData>
): {
  newNodesData: Map<string, EwoksRFNodeData>;
  newEdgesData: Map<string, EwoksRFLinkData>;
} {
  const newNodesData: Map<string, EwoksRFNodeData> = new Map(nodesData);
  newNodesData.forEach((value) => {
    const np = value.ewoks_props;
    np.default_inputs = deleteEmptyLines(np.default_inputs);
    if (np.default_error_attributes?.data_mapping) {
      np.default_error_attributes.data_mapping = deleteEmptyLines(
        np.default_error_attributes?.data_mapping
      );
    }
  });

  const newEdgesData: Map<string, EwoksRFLinkData> = new Map(edgesData);
  newEdgesData.forEach((value) => {
    value.conditions = deleteEmptyLines(value.conditions);
    value.data_mapping = deleteEmptyLines(value.data_mapping);
  });
  return {
    newNodesData,
    newEdgesData,
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
