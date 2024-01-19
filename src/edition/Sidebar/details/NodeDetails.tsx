import InfoIcon from '@mui/icons-material/Info';
import { Box, Checkbox, IconButton } from '@mui/material';
import type { Node } from 'reactflow';

import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import sidebarStyle from '../sidebarStyle';
import SidebarTooltip from '../SidebarTooltip';
import DefaultInputs from '../table/DefaultInputs';
import DefaultErrorNodeControl from './DefaultErrorNodeControl';
import InputTextField from './InputTextField';
import NodeInfo from './NodeInfo';

// DOC: selectedNode details in sidebar
export default function NodeDetails(selectedElement: Node) {
  const nodeData = useNodeDataStore((state) =>
    state.nodesData.get(selectedElement.id),
  );
  assertNodeDataDefined(nodeData, selectedElement.id);

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

  function inputsCompleteChanged(checked: boolean) {
    mergeNodeData(selectedElement.id, {
      ewoks_props: {
        inputs_complete: checked,
      },
    });
  }

  return (
    <Box>
      <InputTextField
        label="Label"
        defaultValue={nodeData.ewoks_props.label || ''}
        onValueSave={(label) => {
          mergeNodeData(selectedElement.id, { ewoks_props: { label } });
        }}
      />
      <InputTextField
        label="Comment"
        defaultValue={nodeData.comment || ''}
        onValueSave={(comment) => {
          mergeNodeData(selectedElement.id, { comment });
        }}
      />

      {selectedElement.type &&
        !['graphInput', 'graphOutput', 'note'].includes(
          selectedElement.type,
        ) && (
          <>
            <DefaultInputs {...selectedElement} />

            <h3 style={sidebarStyle.sectionHeader}>
              Advanced
              <SidebarTooltip
                text={`--Inputs Complete: Set to True when the default input covers all required input
              (used for method and script as the required inputs are unknown).

              --Default Error Node: When set to True all nodes without error handler
              will be linked to this node. ONLY for one node in its graph`}
              >
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </SidebarTooltip>
            </h3>

            <section>
              <Checkbox
                style={sidebarStyle.checkbox}
                checked={nodeData.ewoks_props.inputs_complete || false}
                onChange={(event) =>
                  inputsCompleteChanged(event.target.checked)
                }
                inputProps={{ 'aria-label': 'controlled' }}
                color="primary"
              />
              <span>Inputs Complete</span>
            </section>
            <DefaultErrorNodeControl nodeId={selectedElement.id} />
            <NodeInfo nodeId={selectedElement.id} nodeData={nodeData} />
          </>
        )}
    </Box>
  );
}
