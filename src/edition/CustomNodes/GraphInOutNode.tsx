import Tooltip from '@mui/material/Tooltip';
import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';

import useNodeDataStore from '../../store/useNodeDataStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import type { NodeData } from '../../types';
import { DEFAULT_NODE_VALUES } from '../../utils/defaultValues';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import NodeIcon from './NodeIcon';
import NodeLabel from './NodeLabel';
import { contentStyle, style } from './nodeStyles';

function GraphInOutNode(args: NodeProps<NodeData>) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));
  assertNodeDataDefined(nodeData, args.id);

  const { colorBorder: borderColor, nodeWidth } = nodeData.ui_props;

  const { withImage = DEFAULT_NODE_VALUES.uiProps.withImage } =
    nodeData.ui_props;
  const { withLabel = DEFAULT_NODE_VALUES.uiProps.withLabel } =
    nodeData.ui_props;

  const { task_type } = nodeData.task_props;

  const nodWidth = { width: `${nodeWidth || 100}px` };

  return (
    <div className="node-content" style={{ borderColor }}>
      <Tooltip
        title={
          nodeData.comment ? (
            <span style={style.comment}>{nodeData.comment}</span>
          ) : (
            ''
          )
        }
        enterDelay={800}
        arrow
      >
        <span
          style={{ ...style.displayNode, ...nodWidth, display: 'flex' }}
          className="icons"
        >
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
            label={nodeData.ewoks_props.label || ''}
            showFull={withLabel}
            showCropped={!withLabel && !withImage}
            color="#ced3ee"
          />
          {withImage && (
            <SuspenseBoundary>
              <NodeIcon nodeId={args.id} />
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
        </span>
      </Tooltip>
    </div>
  );
}

export default GraphInOutNode;
