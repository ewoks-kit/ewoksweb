import type { ExecutionParameters, NodeExecutionInput } from '../../api/models';
import { fetchWorkflowsIds } from '../../api/workflows';
import type {
  Condition,
  DataMapping,
  DefaultInput,
  LinkData,
  NodeData,
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

export function curateNodeData(
  nodesData: Map<string, NodeData>,
): Map<string, NodeData> {
  return new Map(
    [...nodesData.entries()].map(([nodeId, nodeData]) => {
      return [
        nodeId,
        {
          ...nodeData,
          ewoks_props: {
            ...nodeData.ewoks_props,
            default_inputs: deleteEmptyLines(
              nodeData.ewoks_props.default_inputs,
            ),
            default_error_attributes:
              nodeData.ewoks_props.default_error_attributes,
          },
        },
      ];
    }),
  );
}

export function curateEdgeData(
  edgesData: Map<string, LinkData>,
): Map<string, LinkData> {
  return new Map(
    [...edgesData.entries()].map(([edgeId, edgeData]) => {
      const {
        data_mapping: rawDataMapping,
        conditions: rawConditions,
        ...restEdgeData
      } = edgeData;
      const conditions = deleteEmptyLines(rawConditions);
      const data_mapping = deleteEmptyLines(rawDataMapping);

      const hasDataMapping =
        !edgeData.map_all_data && data_mapping && data_mapping.length > 0;

      const hasConditions =
        !edgeData.on_error && conditions && conditions.length > 0;

      return [
        edgeId,
        {
          ...restEdgeData,
          ...(hasConditions ? { conditions } : {}),
          ...(hasDataMapping ? { data_mapping } : {}),
        },
      ];
    }),
  );
}

function deleteEmptyLines<T extends DataMapping | Condition | DefaultInput>(
  arrayObjId: T[] | undefined,
): T[] | undefined {
  if (!arrayObjId) {
    return undefined;
  }
  return arrayObjId.filter(
    (obj: DataMapping | Condition | DefaultInput) => obj.name !== '',
  );
}

export function hasDefinedProperties(
  item: NodeExecutionInput,
): item is ExecutionParameters & {
  nodeId: string;
  name: string;
  value: unknown;
  label: string;
} {
  return (
    item.nodeId !== undefined &&
    item.name !== undefined &&
    item.value !== undefined &&
    item.label !== undefined
  );
}
