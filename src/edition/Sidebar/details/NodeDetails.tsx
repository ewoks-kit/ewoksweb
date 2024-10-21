import InfoIcon from '@mui/icons-material/Info';
import { Box, IconButton } from '@mui/material';
import type { Node } from '@xyflow/react';

import useNodeDataStore from '../../../store/useNodeDataStore';
import { DEFAULT_NODE_VALUES } from '../../../utils/defaultValues';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import SidebarCheckbox from '../SidebarCheckbox';
import sidebarStyle from '../sidebarStyle';
import SidebarTooltip from '../SidebarTooltip';
import DefaultInputs from '../table/DefaultInputs';
import DefaultErrorNodeControl from './DefaultErrorNodeControl';
import InputTextField from './InputTextField';
import NodeInfo from './NodeInfo';

interface Props {
  node: Node;
}

export default function NodeDetails(props: Props) {
  const { node } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(node.id));
  assertNodeDataDefined(nodeData, node.id);

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

  const isGraphIONode = ['graphInput', 'graphOutput'].includes(
    nodeData.task_props.task_type,
  );
  const isNoteNode = nodeData.task_props.task_type === 'note';
  const isRegularNode = !isGraphIONode && !isNoteNode;

  return (
    <Box>
      <InputTextField
        label="Label"
        defaultValue={nodeData.ewoks_props.label || ''}
        onValueSave={(label) => {
          mergeNodeData(node.id, { ewoks_props: { label } });
        }}
      />
      {!isNoteNode && (
        <InputTextField
          label="Comment"
          defaultValue={nodeData.comment || ''}
          onValueSave={(comment) => {
            mergeNodeData(node.id, { comment });
          }}
        />
      )}

      {isRegularNode && (
        <>
          <DefaultInputs nodeId={node.id} />

          <h3 style={sidebarStyle.sectionHeader}>
            Advanced
            <SidebarTooltip
              text={`--Force start node: Force this node to be executed before others even if it has predecessors.

              --Default Error Node: When set to True all nodes without error handler
              will be linked to this node. Only for one node in the graph`}
            >
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </SidebarTooltip>
          </h3>

          <SidebarCheckbox
            label="Force start node"
            value={
              nodeData.ewoks_props.force_start_node ||
              DEFAULT_NODE_VALUES.force_start_node
            }
            onChange={(checked) => {
              mergeNodeData(node.id, {
                ewoks_props: {
                  force_start_node: checked,
                },
              });
            }}
          />
          <DefaultErrorNodeControl nodeId={node.id} />
          <NodeInfo nodeId={node.id} nodeData={nodeData} />
        </>
      )}
    </Box>
  );
}
