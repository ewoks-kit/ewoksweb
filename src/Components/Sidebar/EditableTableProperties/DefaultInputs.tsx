import type { EditableTableRow, EwoksRFNodeData } from 'types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import { IconButton } from '@material-ui/core';
import useStore from 'store/useStore';
import SidebarTooltip from '../SidebarTooltip';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import type { Node } from 'reactflow';

export default function DefaultInputs(element: Node) {
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const nodeData = useNodeDataStore((state) => state.nodesData.get(element.id));
  assertNodeDataDefined(nodeData, element.id);

  const defaultInputs = nodeData.ewoks_props.default_inputs || [];
  function addDefaultInputs(nodeDataProps: EwoksRFNodeData) {
    if (defaultInputs.some((x) => x.id === '')) {
      setOpenSnackbar({
        open: true,
        text: 'Please fill in the empty line before adding another!',
        severity: 'warning',
      });
    } else {
      const newNodeData = {
        ...nodeDataProps,
        ewoks_props: {
          ...nodeDataProps.ewoks_props,
          default_inputs: [
            ...(nodeDataProps.ewoks_props.default_inputs || []),
            { id: '', name: '', value: '' },
          ],
        },
      };
      setNodeData(element.id, newNodeData);
    }
  }

  const defaultInputsChanged = (table: EditableTableRow[]) => {
    const newNodeData = {
      ...nodeData,
      ewoks_props: {
        ...nodeData.ewoks_props,
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
            onClick={() => addDefaultInputs(nodeData)}
            data-cy="addDefaultInputsButton"
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      </SidebarTooltip>

      {defaultInputs.length > 0 && (
        <EditableTable
          headers={['Name', 'Value']}
          defaultValues={defaultInputs}
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
