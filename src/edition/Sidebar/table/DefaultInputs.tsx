import InfoIcon from '@mui/icons-material/Info';
import { IconButton } from '@mui/material';
import { nanoid } from 'nanoid';
import type { Node } from 'reactflow';

import useNodeDataStore from '../../../store/useNodeDataStore';
import type { DefaultInput } from '../../../types';
import { RowType } from '../../../types';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import sidebarStyle from '../sidebarStyle';
import SidebarTooltip from '../SidebarTooltip';
import EditableTable from './EditableTable';
import { calcNodeInputOptions } from './utils';

export default function DefaultInputs(element: Node) {
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const nodeData = useNodeDataStore((state) => state.nodesData.get(element.id));
  assertNodeDataDefined(nodeData, element.id);

  function addDefaultInputs(rows: DefaultInput[]) {
    const newNodeData = {
      ewoks_props: {
        default_inputs: [
          ...rows,
          { rowId: nanoid(), name: '', value: '', type: RowType.String },
        ],
      },
    };

    mergeNodeData(element.id, newNodeData);
  }

  const defaultInputsChanged = (table: DefaultInput[]) => {
    const newNodeData = {
      ...nodeData,
      ewoks_props: {
        ...nodeData.ewoks_props,
        default_inputs: table.map((dval) => {
          return {
            rowId: dval.rowId,
            name: dval.name,
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
        nameOptions={calcNodeInputOptions(nodeData)}
      />
    </div>
  );
}
