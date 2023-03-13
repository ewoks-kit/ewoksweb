import type { EditableTableRow, EwoksRFNode } from 'types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditableTable from './EditableTable';
import { IconButton } from '@material-ui/core';
import useStore from 'store/useStore';
import SidebarTooltip from '../SidebarTooltip';
import { useReactFlow } from 'reactflow';

export default function DefaultInputs(element: EwoksRFNode) {
  const { getNodes, setNodes } = useReactFlow();

  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const defautInputs = element.data.ewoks_props.default_inputs;

  function addDefaultInputs() {
    if (defautInputs?.some((x) => x.id === '')) {
      setOpenSnackbar({
        open: true,
        text: 'Please fill in the empty line before adding another!',
        severity: 'warning',
      });
    } else {
      const newNode = {
        ...element,
        data: {
          ...element.data,
          ewoks_props: {
            ...element.data.ewoks_props,
            default_inputs: [
              ...(element.data.ewoks_props.default_inputs || []),
              { id: '', name: '', value: '' },
            ],
          },
        },
      };
      setNodes([...getNodes().filter((nod) => nod.id !== element.id), newNode]);
      setSelectedElement(newNode, 'fromSaveElement');
    }
  }

  const defaultInputsChanged = (table: EditableTableRow[]) => {
    const newNode = {
      ...element,
      data: {
        ...element.data,
        ewoks_props: {
          ...element.data.ewoks_props,
          default_inputs: table.map((dval) => {
            return {
              id: dval.name,
              name: dval.name || '',
              value: dval.value,
            };
          }),
        },
      },
    };
    setNodes([...getNodes().filter((nod) => nod.id !== element.id), newNode]);
    setSelectedElement(newNode, 'fromSaveElement');
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
                ...(element.data.task_props?.optional_input_names || []),
                ...(element.data.task_props?.required_input_names || []),
              ],
            },
            { type: 'input' },
          ]}
        />
      )}
    </div>
  );
}
