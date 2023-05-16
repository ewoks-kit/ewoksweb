import type { EditableTableRow, EwoksRFNodeData } from 'types';
import EditableTable from './EditableTable';
import SidebarTooltip from '../SidebarTooltip';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import type { Node } from 'reactflow';
import { nanoid } from 'nanoid';

export default function DefaultInputs(element: Node) {
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const nodeData = useNodeDataStore((state) => state.nodesData.get(element.id));
  assertNodeDataDefined(nodeData, element.id);

  function addDefaultInputs(nodeDataProps: EwoksRFNodeData) {
    const newNodeData = {
      ...nodeDataProps,
      ewoks_props: {
        ...nodeDataProps.ewoks_props,
        default_inputs: [
          ...(nodeDataProps.ewoks_props.default_inputs || []),
          { id: nanoid(), name: '', value: '' },
        ],
      },
    };
    setNodeData(element.id, newNodeData);
  }

  const defaultInputsChanged = (table: EditableTableRow[]) => {
    const newNodeData = {
      ...nodeData,
      ewoks_props: {
        ...nodeData.ewoks_props,
        default_inputs: table.map((dval) => {
          return {
            id: dval.id,
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
        </div>
      </SidebarTooltip>

      <EditableTable
        headers={['Name', 'Value']}
        defaultValues={nodeData.ewoks_props.default_inputs || []}
        valuesChanged={defaultInputsChanged}
        onRowAdd={() => addDefaultInputs(nodeData)}
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
    </div>
  );
}
