import { fetchWorkflowsIds } from '../../api/workflows';
import type {
  Condition,
  DataMapping,
  Inputs,
  EwoksRFNodeData,
  EwoksRFLinkData,
} from '../../types';

export async function getWorkflowIdsFromServer(): Promise<{
  data: string[];
  error: unknown;
}> {
  try {
    const { data: response } = await fetchWorkflowsIds();
    return { data: response.identifiers, error: null };
  } catch (error) {
    return { data: [], error };
  }
}

export function curateGraph(
  nodesData: Map<string, EwoksRFNodeData>,
  edgesData: Map<string, EwoksRFLinkData>
): {
  newNodesData: Map<string, EwoksRFNodeData>;
  newEdgesData: Map<string, EwoksRFLinkData>;
} {
  const newNodesData: Map<string, EwoksRFNodeData> = new Map(
    [...nodesData.entries()].map(([nodeId, nodeData]) => {
      return [
        nodeId,
        {
          ...nodeData,
          ewoks_props: {
            ...nodeData.ewoks_props,
            default_inputs: deleteEmptyLines(
              nodeData.ewoks_props.default_inputs
            ),
            default_error_attributes:
              nodeData.ewoks_props.default_error_attributes,
          },
        },
      ];
    })
  );

  const newEdgesData: Map<string, EwoksRFLinkData> = new Map(
    [...edgesData.entries()].map(([edgeId, edgeData]) => {
      return [
        edgeId,
        {
          ...edgeData,
          conditions: deleteEmptyLines(edgeData.conditions),
          data_mapping: deleteEmptyLines(edgeData.data_mapping),
        },
      ];
    })
  );

  return {
    newNodesData,
    newEdgesData,
  };
}

function deleteEmptyLines<T extends DataMapping | Condition | Inputs>(
  arrayObjId: T[] | undefined
): T[] | undefined {
  if (!arrayObjId) {
    return undefined;
  }
  return arrayObjId.filter(
    (obj: DataMapping | Condition | Inputs) => obj.name !== ''
  );
}
