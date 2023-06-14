import type { DataMapping } from 'types';
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
  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  const sourceNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.source)
  );

  const targetNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.target)
  );

  function addDataMapping(rows?: DataMapping[]) {
    mergeEdgeData(element.id, {
      data_mapping: [
        ...(rows as DataMapping[]),
        { id: nanoid(), name: '', value: '' },
      ],
    });
  }

  const dataMappingValuesChanged = (table: DataMapping[]) => {
    setEdgeData(element.id, {
      ...edgeData,
      data_mapping: [...table],
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
            type: isClass(sourceNodeData) ? 'select' : 'input',
            values: edgeData.links_input_names || [],
          },
          {
            type: isClass(targetNodeData) ? 'select' : 'input',
            values: [
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
