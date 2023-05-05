import type { DataMapping, EwoksRFLinkData } from 'types';
import { isClass } from './utils';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import type { Edge } from 'reactflow';
import TableDataMapping from './TableDataMapping';
import { nanoid } from 'nanoid';

export default function DataMappingComponent(element: Edge) {
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);
  const setEdgeData = useEdgeDataStore((state) => state.setEdgeData);

  const sourceNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.source)
  );

  const targetNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.target)
  );

  function addDataMapping(edgeDataC: EwoksRFLinkData) {
    setEdgeData(element.id, {
      ...edgeDataC,
      data_mapping: [
        ...(edgeDataC.data_mapping || []),
        {
          id: nanoid(),
          name: '',
          value: '',
        },
      ],
    });
  }

  const dataMappingValuesChanged = (table: DataMapping[]) => {
    const dmap: DataMapping[] = table.map((row) => {
      return {
        source_output: row.name,
        target_input: row.value as string,
      };
    });

    setEdgeData(element.id, {
      ...edgeData,
      data_mapping: dmap,
    });
  };

  return (
    <div>
      {edgeData.data_mapping && (
        <TableDataMapping
          addNewLine={() => addDataMapping(edgeData)}
          headers={['Source', 'Target']}
          defaultValues={edgeData.data_mapping}
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
      )}
    </div>
  );
}
