import { Handle, Position } from 'reactflow';
import { contentStyle, style } from './nodeStyles';
import Tooltip from '@material-ui/core/Tooltip';
import isValidLink from '../../utils/IsValidLink';
import useStore from '../../store/useStore';
import type { Connection, NodeProps } from 'reactflow';
import NodeIcon from './NodeIcon';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import type { EwoksRFLink, EwoksRFNodeData, GraphRF } from '../../types';
import { useReactFlow } from 'reactflow';
import { getNodesData } from '../../utils';
import NodeLabel from './NodeLabel';
import useNodeDataStore from '../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../utils/typeGuards';

function GraphInOutNode(args: NodeProps<EwoksRFNodeData>) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));
  assertNodeDataDefined(nodeData, args.id);

  const {
    withImage,
    withLabel,
    colorBorder: borderColor,
    nodeWidth,
  } = nodeData.ui_props;

  const { task_type } = nodeData.task_props;

  const { getNodes, getEdges } = useReactFlow();

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo
  );
  const showWarningMsg = useStore((state) => state.showWarningMsg);

  const nodWidth = { width: `${nodeWidth || 100}px` };

  const isValidConnection = (connection: Connection) => {
    const graphRf: GraphRF = {
      graph: displayedWorkflowInfo,
      nodes: getNodes(),
      links: getEdges() as EwoksRFLink[],
    };
    const { isValid, reason } = isValidLink(
      connection,
      graphRf,
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
            showFull={withLabel}
            showCropped={!withLabel && !withImage}
            color="#ced3ee"
          />
          {withImage && (
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
