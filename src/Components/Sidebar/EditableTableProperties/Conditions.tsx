import type { EditableTableRow, Conditions as EdgeConditions } from 'types';
import EditableTable from './EditableTable';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import type { Edge } from 'reactflow';
import { nanoid } from 'nanoid';

// DOC: The conditions for a link are being set in this component
export default function Conditions(element: Edge) {
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);

  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  function addConditions(rows: EditableTableRow[] | undefined) {
    const elCon = rows as EdgeConditions[];

    const newEdgeData = {
      on_error: false,
      conditions: [...elCon, { id: nanoid(), name: '', value: false }],
    };
    mergeEdgeData(element.id, newEdgeData);
  }

  function conditionsValuesChanged(table: EditableTableRow[]) {
    mergeEdgeData(element.id, {
      conditions: [...(table as EdgeConditions[])],
    });
    // const newEdgeData = {
    //   ...edgeData,
    //   conditions: table.map((con1) => {
    //     return {
    //       id: con1.id,
    //       name: con1.name,
    //       value: con1.value,
    //     };
    //   }),
    // };
    // setEdgeData(element.id, newEdgeData);
  }

  return (
    <div>
      <EditableTable
        headers={['Output', 'Value']}
        defaultValues={edgeData.conditions || []}
        valuesChanged={conditionsValuesChanged}
        onRowAdd={(rows) => addConditions(rows)}
        typeOfValues={[
          {
            type: 'select',
            values: edgeData.links_input_names || [],
          },
          {
            type: 'input',
          },
        ]}
      />
    </div>
  );
}
