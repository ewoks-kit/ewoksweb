import InfoIcon from '@mui/icons-material/Info';
import { Box, Checkbox, IconButton } from '@mui/material';
import type { Node } from 'reactflow';
import { useReactFlow } from 'reactflow';

import { useNodesIds } from '../../../store/graph-hooks';
import useNodeDataStore from '../../../store/useNodeDataStore';
import type { NodeData } from '../../../types';
import {
  assertNodeDataDefined,
  assertNodeDefined,
} from '../../../utils/typeGuards';
import { generateUniqueNodeId } from '../../../utils/utils';
import sidebarStyle from '../sidebarStyle';
import SidebarTooltip from '../SidebarTooltip';
import DefaultInputs from '../table/DefaultInputs';
import DefaultErrorNodeControl from './DefaultErrorNodeControl';
import NodeInfo from './NodeInfo';
import NodeLabelComment from './NodeLabelComment';

// DOC: selectedNode details in sidebar
export default function NodeDetails(selectedElement: Node) {
  const nodeData = useNodeDataStore((state) =>
    state.nodesData.get(selectedElement.id),
  );
  assertNodeDataDefined(nodeData, selectedElement.id);

  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  const nodesIds = useNodesIds();

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  function handlePropChange(
    propKeyValue: {
      task_identifier?: string;
    },
    nodeDataL: NodeData,
  ) {
    // DOC: if the task_identifier changes (ppfmethod, ppfport, script case) then the id
    // of the node needs to change for a coherent json. Links to/from this node also change!
    if (Object.keys(propKeyValue)[0] === 'task_identifier') {
      // DOC: find unique id based on new task_identifier
      const uniqueId = generateUniqueNodeId(
        nodesIds,
        propKeyValue.task_identifier,
      );

      const newNode = getNodes().find((nod) => nod.id === selectedElement.id);
      assertNodeDefined(newNode, selectedElement.id);

      newNode.id = uniqueId;

      const newLinks = getEdges().map((link) => {
        if (link.source === selectedElement.id) {
          return {
            ...link,
            source: uniqueId,
          };
        }

        if (link.target === selectedElement.id) {
          return {
            ...link,
            target: uniqueId,
          };
        }

        return link;
      });

      setNodeData(uniqueId, {
        ...nodeDataL,
        task_props: {
          ...nodeDataL.task_props,
          task_identifier: propKeyValue.task_identifier || '',
        },
      });

      setNodes([
        ...getNodes().filter((nod) => nod.id !== selectedElement.id),
        newNode,
      ]);
      setEdges(newLinks);

      return;
    }

    if (Object.keys(propKeyValue)[0] === 'icon') {
      mergeNodeData(selectedElement.id, {
        ui_props: { icon: Object.values(propKeyValue)[0] },
      });
    }
  }

  function inputsCompleteChanged(checked: boolean) {
    mergeNodeData(selectedElement.id, {
      ewoks_props: {
        inputs_complete: checked,
      },
    });
  }

  return (
    <Box>
      <NodeLabelComment showComment selectedElement={selectedElement} />
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
            <NodeInfo
              nodeId={selectedElement.id}
              nodeData={nodeData}
              onPropChange={handlePropChange}
            />
          </>
        )}
    </Box>
  );
}
