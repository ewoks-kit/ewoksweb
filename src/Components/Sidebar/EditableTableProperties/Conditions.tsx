import type { EditableTableRow, EwoksRFLink } from 'types';
import { IconButton } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import useStore from 'store/useStore';
import SidebarTooltip from '../SidebarTooltip';

interface ConditionsProps {
  element: EwoksRFLink;
}
// DOC: The conditions for a link are being set in this component
export default function Conditions(props: ConditionsProps) {
  const { element } = props;

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  function addConditions() {
    const elCon = element.data?.conditions || [];

    // check if an empty line already exists
    if (elCon.some((x) => x.id === '')) {
      setOpenSnackbar({
        open: true,
        text: 'Please fill in the empty line before adding another!',
        severity: 'warning',
      });
      return;
    }

    setSelectedElement(
      {
        ...element,
        data: {
          ...element.data,
          on_error: false,
          conditions: [...elCon, { id: '', name: '', value: false }],
        },
      },
      'fromSaveElement'
    );
  }

  function conditionsValuesChanged(table: EditableTableRow[]) {
    setSelectedElement(
      {
        ...element,
        data: {
          ...element.data,
          conditions: table.map((con1) => {
            return {
              source_output: con1.name,
              value: con1.value,
            };
          }),
        },
      },
      'fromSaveElement'
    );
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
      {element.data?.conditions && element.data.conditions.length > 0 && (
        <EditableTable
          headers={['Output', 'Value']}
          defaultValues={element.data.conditions}
          valuesChanged={conditionsValuesChanged}
          typeOfValues={[
            {
              type: 'select',
              values: element.data.links_input_names || [],
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
