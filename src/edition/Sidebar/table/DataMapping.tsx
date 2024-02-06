import { nanoid } from 'nanoid';
import type { Edge } from 'reactflow';
import type { DataMapping } from 'types';

import useEdgeDataStore from '../../../store/useEdgeDataStore';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import DataMappingTable from './DataMappingTable';
import styles from './Table.module.css';
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
    state.nodesData.get(element.source),
  );

  const targetNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.target),
  );

  function addDataMapping(rows?: DataMapping[]) {
    mergeEdgeData(element.id, {
      data_mapping: [...(rows || []), { rowId: nanoid(), name: '', value: '' }],
    });
  }

  function dataMappingValuesChanged(table: DataMapping[]) {
    setEdgeData(element.id, {
      ...edgeData,
      data_mapping: [...table],
    });
  }

  return (
    <div>
      <DataMappingTable
        disable={mapAllData}
        onRowAdd={(rows) => addDataMapping(rows)}
        values={edgeData.data_mapping || []}
        onValuesChange={dataMappingValuesChanged}
        sourceType={calcTypeOfValues('inputs', sourceNodeData, edgeData)}
        targetType={calcTypeOfValues('outputs', targetNodeData, edgeData)}
      />
      {mapAllData && (
        <div className={styles.warning}>
          Data Mappings have no effect when Map all Data is enabled. They will
          be removed when saving the workflow.
        </div>
      )}
    </div>
  );
}
