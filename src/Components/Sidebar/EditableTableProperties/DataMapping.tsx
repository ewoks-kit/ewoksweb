import type { DataMapping, EditableTableRow, EwoksRFLinkData } from 'types';
import { isClass } from './utils';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import type { Edge } from 'reactflow';
import TableDataMapping from './TableDataMapping';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import useDebounce from '../../../hooks/useDebounce';

export default function DataMappingComponent(element: Edge) {
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  console.log(edgeData);

  assertEdgeDataDefined(edgeData, element.id);
  const setEdgeData = useEdgeDataStore((state) => state.setEdgeData);

  const sourceNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.source)
  );

  const targetNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.target)
  );

  const [dmapping, setDmapping] = useState<DataMapping[]>(
    edgeData.data_mapping || []
  );
  const debouncedDmapping = useDebounce(dmapping, 600);

  useEffect(() => {
    console.log(debouncedDmapping);

    setEdgeData(element.id, {
      ...edgeData,
      data_mapping: debouncedDmapping,
    });
  }, [debouncedDmapping]);

  function addDataMapping(
    edgeDataC: EwoksRFLinkData,
    rows?: EditableTableRow[]
  ) {
    setEdgeData(element.id, {
      ...edgeDataC,
      data_mapping: [
        ...(rows as DataMapping[]),
        {
          id: nanoid(),
          name: '',
          value: '',
        },
      ],
    });
  }

  const dataMappingValuesChanged = (table: DataMapping[]) => {
    console.log(table);

    const dmap: DataMapping[] = table.map((row) => {
      return {
        id: row.source_output ? row.source_output.toString() : row.id,
        name: row.name,
        value: row.value,
        source_output: row.name,
        target_input: row.value as string,
      };
    });
    console.log(dmap);
    setDmapping(dmap);

    // setEdgeData(element.id, {
    //   ...edgeData,
    //   data_mapping: dmap,
    // });
  };

  return (
    <div>
      <TableDataMapping
        onRowAdd={(rows) => addDataMapping(edgeData, rows)}
        headers={['Source', 'Target']}
        values={edgeData.data_mapping || []}
        valuesChanged={dataMappingValuesChanged}
        typeOfValues={[
          {
            type: isClass(sourceNodeData) ? 'select' : 'input',
            values: edgeData.links_input_names || [],
          },
          {
            type: isClass(targetNodeData) ? 'select' : 'input',
            values: [
              ...(edgeData.links_required_output_names || []),
              ...(edgeData.links_optional_output_names || []),
            ],
          },
        ]}
      />
    </div>
  );
}
