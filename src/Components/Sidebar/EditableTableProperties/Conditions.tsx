import type { EditableTableRow, EwoksRFLinkData } from 'types';
import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import SidebarTooltip from '../SidebarTooltip';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import type { Edge } from 'reactflow';
import { nanoid } from 'nanoid';
import { identity } from 'lodash';

// DOC: The conditions for a link are being set in this component
export default function Conditions(element: Edge) {
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);

  const setEdgeData = useEdgeDataStore((state) => state.setEdgeData);

  function addConditions(edgeDataL: EwoksRFLinkData) {
    const elCon = edgeDataL.conditions || [];

    const newEdgeData = {
      ...edgeDataL,
      on_error: false,
      conditions: [...elCon, { id: nanoid(), name: '', value: false }],
    };
    setEdgeData(element.id, newEdgeData);
  }

  function conditionsValuesChanged(table: EditableTableRow[]) {
    console.log(table);

    const newEdgeData = {
      ...edgeData,
      conditions: table.map((con1) => {
        return {
          id: con1.id,
          name: con1.name,
          value: con1.value,
        };
      }),
    };
    setEdgeData(element.id, newEdgeData);
  }

  return (
    <div>
      <SidebarTooltip
        text={`Provides a list of expected values for source outputs.
          [{"source_output": "result", "value": 10}]`}
      >
        <b>Conditions </b>
      </SidebarTooltip>

      <IconButton
        style={{ padding: '1px' }}
        aria-label="Add Condition"
        onClick={() => addConditions(edgeData)}
        data-cy="addConditionsButton"
      >
        <AddCircleOutlineIcon />
      </IconButton>
      {edgeData.conditions && edgeData.conditions.length > 0 && (
        <EditableTable
          headers={['Output', 'Value']}
          defaultValues={edgeData.conditions}
          valuesChanged={conditionsValuesChanged}
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
      )}
    </div>
  );
}
