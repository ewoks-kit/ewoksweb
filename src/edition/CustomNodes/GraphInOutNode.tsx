import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';

import useNodeDataStore from '../../store/useNodeDataStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import type { NodeData } from '../../types';
import { DEFAULT_NODE_VALUES } from '../../utils/defaultValues';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import NodeContent from './NodeContent';
import NodeIcon from './NodeIcon';
import NodeLabel from './NodeLabel';
import { contentStyle } from './nodeStyles';

function GraphInOutNode(props: NodeProps<NodeData>) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(props.id));
  assertNodeDataDefined(nodeData, props.id);
  const { ui_props: uiProps, comment } = nodeData;

  const { colorBorder } = uiProps;
  const { withImage = DEFAULT_NODE_VALUES.uiProps.withImage } = uiProps;
  const { withLabel = DEFAULT_NODE_VALUES.uiProps.withLabel } = uiProps;

  const { task_type } = nodeData.task_props;

  return (
    <NodeContent borderColor={colorBorder} tooltip={comment}>
      <div style={{ display: 'flex' }}>
        {task_type === 'graphInput' && (
          <Handle
            type="source"
            position={Position.Right}
            id="sr"
            style={{ ...contentStyle.handle, ...contentStyle.handleSource }}
            isConnectable
          />
        )}
        <NodeLabel
          id={props.id}
          label={nodeData.ewoks_props.label}
          showFull={withLabel}
          showCropped={!withLabel && !withImage}
          color="#ced3ee"
        />
        {withImage && (
          <SuspenseBoundary>
            <NodeIcon nodeId={props.id} />
          </SuspenseBoundary>
        )}
        {task_type === 'graphOutput' && (
          <Handle
            type="target"
            position={Position.Left}
            id="tl"
            style={{
              ...contentStyle.handle,
              ...contentStyle.handleTarget,
            }}
            isConnectable
          />
        )}
      </div>
    </NodeContent>
  );
}

export default GraphInOutNode;
