import { Handle, Position } from 'reactflow';
import { contentStyle, style } from './nodeStyles';
import Tooltip from '@material-ui/core/Tooltip';
import isValidLink from '../../utils/IsValidLink';
import useSnackbarStore from '../../store/useSnackbarStore';
import type { Connection, NodeProps } from 'reactflow';
import NodeIcon from './NodeIcon';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import type { EwoksRFNodeData } from '../../types';
import { useReactFlow } from 'reactflow';
import { getNodesData } from '../../utils';
import NodeLabel from './NodeLabel';
import useNodeDataStore from '../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import { DEFAULT_NODE_VALUES } from '../../utils/defaultValues';

function GraphInOutNode(args: NodeProps<EwoksRFNodeData>) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));
  assertNodeDataDefined(nodeData, args.id);

  const {
    withImage,
    withLabel,
    colorBorder: borderColor,
    nodeWidth,
  } = nodeData.ui_props;

  const hasImage =
    withImage === DEFAULT_NODE_VALUES.uiProps.withImage ||
    withImage === undefined;
  const hasLabel =
    withLabel === DEFAULT_NODE_VALUES.uiProps.withLabel ||
    withLabel === undefined;

  const { task_type } = nodeData.task_props;

  const { getNodes, getEdges } = useReactFlow();

  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);

  const nodWidth = { width: `${nodeWidth || 100}px` };

  const isValidConnection = (connection: Connection) => {
    const { isValid, reason } = isValidLink(
      connection,
      getNodes(),
      getEdges(),
      getNodesData()
    );
    if (!isValid) {
      showWarningMsg(reason);
    }
    return isValid;
  };

  return (
    <div
      className="node-content"
      style={borderColor ? { borderColor } : undefined}
      id="choice"
      role="button"
      tabIndex={0}
    >
      <Tooltip
        title={
          args.data.comment ? (
            <span style={style.comment}>{args.data.comment}</span>
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
              isValidConnection={isValidConnection}
              isConnectable
            />
          )}
          <NodeLabel
            label={nodeData.ewoks_props.label || ''}
            showFull={hasLabel}
            showCropped={!hasLabel && !hasImage}
            color="#ced3ee"
          />
          {hasImage && (
            <SuspenseBoundary>
              <NodeIcon
                nodeId={args.id}
                onDragStart={(e) => e.preventDefault()}
              />
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
              isValidConnection={isValidConnection}
            />
          )}
        </span>
      </Tooltip>
    </div>
  );
}

export default GraphInOutNode;
