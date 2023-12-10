import { nanoid } from 'nanoid';
import type { DataMapping, InputTableRow } from 'types';

import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import TableDataMapping from './TableDataMapping';

export default function NodeDataMapping({ nodeId }: { nodeId: string }) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(nodeId));
  assertNodeDataDefined(nodeData, nodeId);
  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  function addDataMapping(rows: InputTableRow[] | undefined) {
    mergeNodeData(nodeId, {
      ewoks_props: {
        default_error_attributes: {
          data_mapping: [
            ...(rows as DataMapping[]),
            { id: nanoid(), name: '', value: '' },
          ],
        },
      },
    });
  }

  const dataMappingValuesChanged = (table: DataMapping[]) => {
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
  };

  return (
    <div>
      <TableDataMapping
        onRowAdd={(rows) => addDataMapping(rows)}
        headers={['Source', 'Target']}
        values={
          nodeData.ewoks_props.default_error_attributes?.data_mapping || []
        }
        valuesChanged={dataMappingValuesChanged}
        typeOfValues={[{ typeOfInput: 'input' }, { typeOfInput: 'input' }]}
      />
    </div>
  );
}
