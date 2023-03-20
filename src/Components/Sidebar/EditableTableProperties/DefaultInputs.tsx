import type { EditableTableRow, EwoksRFNode } from 'types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import { IconButton } from '@material-ui/core';
import useStore from 'store/useStore';
import SidebarTooltip from '../SidebarTooltip';
import useNodeDataStore from '../../../store/useNodeDataStore';

export default function DefaultInputs(element: EwoksRFNode) {
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const nodesData = useNodeDataStore((state) => state.nodesData);

  const nodeData = nodesData.get(element.id);

  const defautInputs = nodeData?.ewoks_props.default_inputs || [];

  function addDefaultInputs() {
    if (defautInputs?.some((x) => x.id === '')) {
      setOpenSnackbar({
        open: true,
        text: 'Please fill in the empty line before adding another!',
        severity: 'warning',
      });
    } else {
      if (!nodeData) {
        return;
      }
      const newNodeData = {
        ...nodeData,
        ewoks_props: {
          ...nodeData?.ewoks_props,
          default_inputs: [
            ...(nodeData?.ewoks_props.default_inputs || []),
            { id: '', name: '', value: '' },
          ],
        },
      };
      setNodeData(element.id, newNodeData);
    }
  }

  const defaultInputsChanged = (table: EditableTableRow[]) => {
    if (!nodeData) {
      return;
    }
    const newNodeData = {
      ...nodeData,
      ewoks_props: {
        ...nodeData?.ewoks_props,
        default_inputs: table.map((dval) => {
          return {
            id: dval.name,
            name: dval.name || '',
            value: dval.value,
          };
        }),
      },
    };
    setNodeData(element.id, newNodeData);
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
            onClick={() => addDefaultInputs()}
            data-cy="addDefaultInputsButton"
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      </SidebarTooltip>

      {defautInputs && defautInputs.length > 0 && (
        <EditableTable
          headers={['Name', 'Value']}
          defaultValues={defautInputs}
          valuesChanged={defaultInputsChanged}
          typeOfValues={[
            {
              type: 'select',
              values: [
                ...(nodeData?.task_props?.optional_input_names || []),
                ...(nodeData?.task_props?.required_input_names || []),
              ],
            },
            { type: 'input' },
          ]}
        />
      )}
    </div>
  );
}
