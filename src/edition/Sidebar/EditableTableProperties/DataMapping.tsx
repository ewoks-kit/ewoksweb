import { nanoid } from 'nanoid';
import type { Edge } from 'reactflow';
import type { DataMapping } from 'types';

import useEdgeDataStore from '../../../store/useEdgeDataStore';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import TableDataMapping from './TableDataMapping';
import { calcTypeOfValues } from './utils';

interface Props {
  element: Edge;
  mapAllData?: boolean | undefined;
}

export default function DataMappingComponent({ element, mapAllData }: Props) {
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
        disable={mapAllData}
        onRowAdd={(rows) => addDataMapping(rows)}
        headers={['Source', 'Target']}
        values={edgeData.data_mapping || []}
        valuesChanged={dataMappingValuesChanged}
        typeOfValues={[
          calcTypeOfValues('inputs', sourceNodeData, edgeData),
          calcTypeOfValues('outputs', targetNodeData, edgeData),
        ]}
      />
    </div>
  );
}
