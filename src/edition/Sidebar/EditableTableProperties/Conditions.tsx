import type { EditableTableRow, Condition as EdgeConditions } from 'types';
import EditableTable from './EditableTable';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import type { Edge } from 'reactflow';
import { nanoid } from 'nanoid';
import { calcTypeOfValues } from './utils';
import useNodeDataStore from '../../../store/useNodeDataStore';

interface Props {
  element: Edge;
  isOnErrorSelected: boolean | undefined;
}

// DOC: The conditions for a link are being set in this component
export default function Conditions({ element, isOnErrorSelected }: Props) {
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);

  const sourceNodeData = useNodeDataStore((state) =>
    state.nodesData.get(element.source)
  );

  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);
  const setEdgeData = useEdgeDataStore((state) => state.setEdgeData);

  function addConditions(rows: EditableTableRow[] | undefined) {
    const elCon = rows as EdgeConditions[];

    const newEdgeData = {
      on_error: false,
      conditions: [...elCon, { id: nanoid(), name: '', value: false }],
    };
    mergeEdgeData(element.id, newEdgeData);
  }

  function conditionsValuesChanged(table: EditableTableRow[]) {
    const newEdgeData = {
      ...edgeData,
      conditions: table.map((con) => {
        return {
          id: con.id,
          name: con.name,
          value: con.value,
          type: con.type,
        };
      }),
    };
    setEdgeData(element.id, newEdgeData);
  }

  return (
    <div>
      <EditableTable
        inactive={isOnErrorSelected}
        headers={['Output', 'Value']}
        defaultValues={edgeData.conditions || []}
        valuesChanged={conditionsValuesChanged}
        onRowAdd={(rows) => addConditions(rows)}
        typeOfValues={[
          calcTypeOfValues('inputs', sourceNodeData, edgeData),
          {
            typeOfInput: 'input',
          },
        ]}
      />
    </div>
  );
}
