import { nanoid } from 'nanoid';

import useNodeDataStore from '../../../store/useNodeDataStore';
import type { DataMapping } from '../../../types';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import DataMappingTable from './DataMappingTable';

export default function NodeDataMapping({ nodeId }: { nodeId: string }) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(nodeId));
  assertNodeDataDefined(nodeData, nodeId);
  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  function addDataMapping(oldDataMapping: DataMapping[]) {
    mergeNodeData(nodeId, {
      ewoks_props: {
        default_error_attributes: {
          data_mapping: [
            ...oldDataMapping,
            { rowId: nanoid(), source: '', target: '' },
          ],
        },
      },
    });
  }

  function dataMappingValuesChanged(table: DataMapping[]) {
    assertNodeDataDefined(nodeData, nodeId);
    setNodeData(nodeId, {
      ...nodeData,
      ewoks_props: {
        ...nodeData.ewoks_props,
        default_error_attributes: {
          ...nodeData.ewoks_props.default_error_attributes,
          data_mapping: [...table],
        },
      },
    });
  }

  return (
    <div>
      <DataMappingTable
        onRowAdd={(rows) => addDataMapping(rows)}
        values={
          nodeData.ewoks_props.default_error_attributes?.data_mapping || []
        }
        onValuesChange={dataMappingValuesChanged}
      />
    </div>
  );
}
