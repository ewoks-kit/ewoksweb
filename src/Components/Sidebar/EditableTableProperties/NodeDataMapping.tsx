import type { DataMapping, EditableTableRow } from 'types';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import type { Node } from 'reactflow';
import TableDataMapping from './TableDataMapping';
import { nanoid } from 'nanoid';

export default function NodeDataMapping(element: Node) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(element.id));
  assertNodeDataDefined(nodeData, element.id);
  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  function addDataMapping(rows: EditableTableRow[] | undefined) {
    mergeNodeData(element.id, {
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
    const dmap: DataMapping[] = table.map((row) => {
      return {
        id: row.id,
        name: row.name,
        value: row.value,
      };
    });

    setNodeData(element.id, {
      ...nodeData,
      ewoks_props: {
        ...nodeData.ewoks_props,
        default_error_attributes: {
          ...nodeData.ewoks_props.default_error_attributes,
          data_mapping: dmap,
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
        typeOfValues={[
          {
            values: [],
          },
          {
            values: [],
          },
        ]}
      />
    </div>
  );
}
