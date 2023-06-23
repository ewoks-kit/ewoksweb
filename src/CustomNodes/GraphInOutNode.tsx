import { Handle, Position } from 'reactflow';
import { contentStyle, style } from './nodeStyles';
import Tooltip from '@material-ui/core/Tooltip';
import isValidLink from '../utils/IsValidLink';
import useStore from '../store/useStore';
import type { Connection, NodeProps } from 'reactflow';
import NodeIcon from './NodeIcon';
import IconBoundary from '../IconBoundary';
import type { EwoksRFLink, EwoksRFNodeData, GraphRF } from '../types';
import { useReactFlow } from 'reactflow';
import { getNodesData } from '../utils';
import NodeLabel from './NodeLabel';
import useNodeDataStore from '../store/useNodeDataStore';
import { assertNodeDataDefined } from '../utils/typeGuards';

function GraphInOutNode(
  //   {
  //   data: {
  //     comment,
  //     ui_props: {
  //       withImage,
  //       withLabel,
  //       type,
  //       colorBorder: borderColor,
  //       icon: image,
  //       executing,
  //       nodeWidth,
  //     },
  //     ewoks_props: { label },
  //   },
  // }
  args: NodeProps<EwoksRFNodeData>
) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));
  assertNodeDataDefined(nodeData, args.id);

  const {
    withImage,
    withLabel,
    type,
    colorBorder: borderColor,
    icon: image,
    executing,
    nodeWidth,
  } = nodeData.ui_props;

  const { getNodes, getEdges } = useReactFlow();

  const inExecutionMode = useStore((state) => state.inExecutionMode);
  const graphInfo = useStore((state) => state.graphInfo);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const nodWidth = { width: `${nodeWidth || 100}px` };

  const isValidConnection = (connection: Connection) => {
    const graphRf: GraphRF = {
      graph: graphInfo,
      nodes: getNodes(),
      links: getEdges() as EwoksRFLink[],
    };
    const { isValid, reason } = isValidLink(
      connection,
      graphRf,
      getNodesData()
    );
    if (!isValid) {
      setOpenSnackbar({
        open: true,
        text: reason,
        severity: 'warning',
      });
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
        <span style={{ ...style.displayNode, ...nodWidth }} className="icons">
          {type === 'graphInput' && (
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
            label={args.data.ewoks_props.label || ''}
            showFull={withLabel}
            showCropped={!withLabel && !withImage}
            color="#ced3ee"
          />
          {(withImage || inExecutionMode) && (
            <IconBoundary>
              <NodeIcon
                image={image}
                hasSpinner={
                  inExecutionMode &&
                  type !== 'graphOutput' &&
                  type !== 'graphInput'
                }
                spinnerProps={{
                  getting: executing,
                  tooltip: 'Execution',
                  action: () => true,
                }}
                onDragStart={(e) => e.preventDefault()}
              />
            </IconBoundary>
          )}
          {type === 'graphOutput' && (
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
