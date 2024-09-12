import InfoIcon from '@mui/icons-material/Info';
import { Box, Checkbox, IconButton } from '@mui/material';
import type { Node } from 'reactflow';

import useNodeDataStore from '../../../store/useNodeDataStore';
import { DEFAULT_NODE_VALUES } from '../../../utils/defaultValues';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import sidebarStyle from '../sidebarStyle';
import SidebarTooltip from '../SidebarTooltip';
import DefaultInputs from '../table/DefaultInputs';
import DefaultErrorNodeControl from './DefaultErrorNodeControl';
import InputTextField from './InputTextField';
import NodeInfo from './NodeInfo';

export default function NodeDetails(node: Node) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(node.id));
  assertNodeDataDefined(nodeData, node.id);

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

  return (
    <Box>
      <InputTextField
        label="Label"
        defaultValue={nodeData.ewoks_props.label || ''}
        onValueSave={(label) => {
          mergeNodeData(node.id, { ewoks_props: { label } });
        }}
      />
      <InputTextField
        label="Comment"
        defaultValue={nodeData.comment || ''}
        onValueSave={(comment) => {
          mergeNodeData(node.id, { comment });
        }}
      />

      {node.type &&
        !['graphInput', 'graphOutput', 'note'].includes(node.type) && (
          <>
            <DefaultInputs {...node} />

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

            <section>
              <Checkbox
                style={sidebarStyle.checkbox}
                checked={
                  nodeData.ewoks_props.force_start_node ||
                  DEFAULT_NODE_VALUES.force_start_node
                }
                onChange={(event, checked) => {
                  mergeNodeData(node.id, {
                    ewoks_props: {
                      force_start_node: checked,
                    },
                  });
                }}
                inputProps={{ 'aria-label': 'controlled' }}
                color="primary"
              />
              <span>Force start node</span>
            </section>
            <DefaultErrorNodeControl nodeId={node.id} />
            <NodeInfo nodeId={node.id} nodeData={nodeData} />
          </>
        )}
    </Box>
  );
}
