import InfoIcon from '@mui/icons-material/Info';
import { IconButton } from '@mui/material';
import { nanoid } from 'nanoid';

import useNodeDataStore from '../../../store/useNodeDataStore';
import type { DefaultInput, NodeData } from '../../../types';
import { RowType } from '../../../types';
import { DEFAULT_NODE_VALUES } from '../../../utils/defaultValues';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import sidebarStyle from '../sidebarStyle';
import SidebarTooltip from '../SidebarTooltip';
import EditableTable from './EditableTable';
import { calcNodeInputOptions } from './utils';

interface Props {
  nodeId: string;
}

export default function DefaultInputs(props: Props) {
  const { nodeId } = props;
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const nodeData = useNodeDataStore((state) => state.nodesData.get(nodeId));
  assertNodeDataDefined(nodeData, nodeId);

  function addDefaultInputs(rows: DefaultInput[]) {
    const newNodeData = {
      ewoks_props: {
        default_inputs: [
          ...rows,
          { rowId: nanoid(), name: '', value: '', type: RowType.String },
        ],
      },
    };

    mergeNodeData(nodeId, newNodeData);
  }

  function defaultInputsChanged(
    oldNodeData: NodeData,
    defaultInputs: DefaultInput[],
  ) {
    const newNodeData = {
      ...oldNodeData,
      ewoks_props: {
        ...oldNodeData.ewoks_props,
        default_inputs: defaultInputs,
      },
    };
    setNodeData(nodeId, newNodeData);
  }

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
        defaultValues={
          nodeData.ewoks_props.default_inputs ||
          DEFAULT_NODE_VALUES.default_inputs
        }
        valuesChanged={(table) => defaultInputsChanged(nodeData, table)}
        onRowAdd={(rows) => addDefaultInputs(rows)}
        nameOptions={calcNodeInputOptions(nodeData)}
      />
    </div>
  );
}
