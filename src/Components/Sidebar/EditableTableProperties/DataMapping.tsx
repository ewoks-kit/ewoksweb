import type { DataMapping, EditableTableRow } from 'types';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import type { Edge } from 'reactflow';
import TableDataMapping from './TableDataMapping';
import { nanoid } from 'nanoid';

export default function DataMappingComponent(element: Edge) {
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));

  assertEdgeDataDefined(edgeData, element.id);
  const setEdgeData = useEdgeDataStore((state) => state.setEdgeData);
  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  function addDataMapping(rows?: EditableTableRow[]) {
    mergeEdgeData(element.id, {
      data_mapping: [
        ...(rows as DataMapping[]),
        { id: nanoid(), name: '', value: '' },
      ],
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

    setEdgeData(element.id, {
      ...edgeData,
      data_mapping: dmap,
    });
  };

  return (
    <div>
      <TableDataMapping
        onRowAdd={(rows) => addDataMapping(rows)}
        headers={['Source', 'Target']}
        values={edgeData.data_mapping || []}
        valuesChanged={dataMappingValuesChanged}
        typeOfValues={[
          {
            allValues: edgeData.links_input_names || [],
          },
          {
            allValues: [
              ...(edgeData.links_required_output_names || []),
              ...(edgeData.links_optional_output_names || []),
            ],
            requiredValues: edgeData.links_required_output_names || [],
          },
        ]}
      />
    </div>
  );
}
