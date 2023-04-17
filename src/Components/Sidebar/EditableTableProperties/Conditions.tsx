import type { EditableTableRow, EwoksRFLink, EwoksRFLinkData } from 'types';
import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import useStore from 'store/useStore';
import SidebarTooltip from '../SidebarTooltip';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';

interface ConditionsProps {
  element: EwoksRFLink;
}
// DOC: The conditions for a link are being set in this component
export default function Conditions(props: ConditionsProps) {
  const { element } = props;
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);

  const setEdgeData = useEdgeDataStore((state) => state.setEdgeData);

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  function addConditions(edgeDataL: EwoksRFLinkData) {
    const elCon = edgeDataL.conditions || [];

    if (elCon.some((x) => x.id === '')) {
      setOpenSnackbar({
        open: true,
        text: 'Please fill in the empty line before adding another!',
        severity: 'warning',
      });
      return;
    }

    const newEdgeData = {
      ...edgeDataL,
      on_error: false,
      conditions: [...elCon, { id: '', name: '', value: false }],
    };
    setEdgeData(element.id, newEdgeData);
  }

  function conditionsValuesChanged(table: EditableTableRow[]) {
    const newEdgeData = {
      ...edgeData,
      conditions: table.map((con1) => {
        return {
          source_output: con1.name,
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
