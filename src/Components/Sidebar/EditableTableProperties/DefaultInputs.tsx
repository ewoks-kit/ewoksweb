import type { EditableTableRow, EwoksRFNodeData } from 'types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import { IconButton } from '@material-ui/core';
import useStore from 'store/useStore';
import SidebarTooltip from '../SidebarTooltip';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import useSelectedElementStore from '../../../store/useSelectedElementStore';

export default function DefaultInputs() {
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const element = useSelectedElementStore((state) => state.selectedElement);

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const nodeData = useNodeDataStore((state) => state.nodesData.get(element.id));
  assertNodeDataDefined(nodeData, element.id);

  const defautInputs = nodeData.ewoks_props.default_inputs || [];

  function addDefaultInputs(nodeDataProps: EwoksRFNodeData) {
    if (defautInputs.some((x) => x.id === '')) {
      setOpenSnackbar({
        open: true,
        text: 'Please fill in the empty line before adding another!',
        severity: 'warning',
      });
    } else {
      const newNodeData = {
        ewoks_props: {
          default_inputs: [
            ...(nodeDataProps.ewoks_props.default_inputs || []),
            { id: '', name: '', value: '' },
          ],
        },
      };
      mergeNodeData(element.id, newNodeData);
    }
  }

  const defaultInputsChanged = (table: EditableTableRow[]) => {
    const newNodeData = {
      ewoks_props: {
        default_inputs: table.map((dval) => {
          return {
            id: dval.name,
            name: dval.name || '',
            value: dval.value,
          };
        }),
      },
    };
    mergeNodeData(element.id, newNodeData);
  };

  return (
    <div>
      <SidebarTooltip
        text={`Used to create an input when not provided
              by the output of other connected nodes(tasks).`}
      >
        <div>
          <b>Default Inputs </b>
          <IconButton
            style={{ padding: '1px' }}
            aria-label="delete"
            onClick={() => addDefaultInputs(nodeData)}
            data-cy="addDefaultInputsButton"
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      </SidebarTooltip>

      {defautInputs.length > 0 && (
        <EditableTable
          headers={['Name', 'Value']}
          defaultValues={defautInputs}
          valuesChanged={defaultInputsChanged}
          typeOfValues={[
            {
              type: 'select',
              values: [
                ...(nodeData.task_props.optional_input_names || []),
                ...(nodeData.task_props.required_input_names || []),
              ],
            },
            { type: 'input' },
          ]}
        />
      )}
    </div>
  );
}
