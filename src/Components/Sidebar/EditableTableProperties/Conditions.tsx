import type { EditableTableRow, EwoksRFLink, EwoksRFLinkData } from 'types';
import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import useStore from 'store/useStore';
import SidebarTooltip from '../SidebarTooltip';
import useEdgeDataStore from '../../../store/useEdgeDataStore';

interface ConditionsProps {
  element: EwoksRFLink;
}
// DOC: The conditions for a link are being set in this component
export default function Conditions(props: ConditionsProps) {
  const { element } = props;
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  function addConditions() {
    const elCon = edgeData?.conditions || [];

    if (elCon.some((x) => x.id === '')) {
      setOpenSnackbar({
        open: true,
        text: 'Please fill in the empty line before adding another!',
        severity: 'warning',
      });
      return;
    }

    const newEdgeData = {
      on_error: false,
      conditions: [...elCon, { id: '', name: '', value: false }],
    };
    mergeEdgeData(element.id, newEdgeData as EwoksRFLinkData);
  }

  function conditionsValuesChanged(table: EditableTableRow[]) {
    const newEdgeData = {
      conditions: table.map((con1) => {
        return {
          source_output: con1.name,
          value: con1.value,
        };
      }),
    };
    mergeEdgeData(element.id, newEdgeData as EwoksRFLinkData);
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
        onClick={addConditions}
        data-cy="addConditionsButton"
      >
        <AddCircleOutlineIcon />
      </IconButton>
      {edgeData?.conditions && edgeData.conditions.length > 0 && (
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
