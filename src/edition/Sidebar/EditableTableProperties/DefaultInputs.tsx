import { IconButton } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { nanoid } from 'nanoid';
import type { Node } from 'reactflow';
import type { DefaultInput, EditableTableRow } from 'types';

import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import sidebarStyle from '../sidebarStyle';
import SidebarTooltip from '../SidebarTooltip';
import EditableTable from './EditableTable';
import { isClass } from './utils';

export default function DefaultInputs(element: Node) {
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const nodeData = useNodeDataStore((state) => state.nodesData.get(element.id));
  assertNodeDataDefined(nodeData, element.id);

  function addDefaultInputs(rows: EditableTableRow[] | undefined) {
    const newNodeData = {
      ewoks_props: {
        default_inputs: [
          ...(rows as DefaultInput[]),
          { id: nanoid(), name: '', value: '' },
        ],
      },
    };

    mergeNodeData(element.id, newNodeData);
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
            type: dval.type,
          };
        }),
      },
    };
    setNodeData(element.id, newNodeData);
  };

  return (
    <div>
      <h3 style={sidebarStyle.sectionHeader}>
        Default Inputs
        <SidebarTooltip text="Inputs used when no value is provided by the input nodes.">
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </SidebarTooltip>
      </h3>
      <EditableTable
        headers={['Name', 'Value']}
        defaultValues={nodeData.ewoks_props.default_inputs || []}
        valuesChanged={defaultInputsChanged}
        onRowAdd={(rows) => addDefaultInputs(rows)}
        typeOfValues={[
          {
            typeOfInput: isClass(nodeData) ? 'select' : 'input',
            values: [
              ...(nodeData.task_props.required_input_names || []),
              ...(nodeData.task_props.optional_input_names || []),
            ],
            requiredValues: nodeData.task_props.required_input_names || [],
          },
          { typeOfInput: 'input' },
        ]}
      />
    </div>
  );
}
