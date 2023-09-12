import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { Connection, NodeProps } from 'reactflow';
import { contentStyle, style } from './nodeStyles';
import isValidLink from '../../utils/IsValidLink';
import useSnackbarStore from '../../store/useSnackbarStore';
import type { EwoksRFNodeData } from '../../types';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import { getNodesData } from '../../utils';
import { Tooltip } from '@material-ui/core';
import NodeLabel from './NodeLabel';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import NodeIcon from './NodeIcon';
import { DEFAULT_NODE_VALUES } from '../../utils/defaultValues';
import useStore from '../../store/useStore';

function GraphNode(props: NodeProps<EwoksRFNodeData>) {
  const { getNodes, getEdges } = useReactFlow();

  const { id } = props;
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);
  const nodeData = useNodeDataStore((state) => state.nodesData.get(id));
  const { loadedGraphs } = useStore.getState();

  assertNodeDataDefined(nodeData, id);

  const { ui_props: uiProps } = nodeData;
  const isOnServer = loadedGraphs.has(id);
  // The id in the props seems to be the label....
  console.log(loadedGraphs, id, nodeData.ewoks_props.label, isOnServer);

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

  const nodeWidth = { width: `${uiProps.nodeWidth || 100}px` };
  const { withImage = DEFAULT_NODE_VALUES.uiProps.withImage } = uiProps;
  const { withLabel = DEFAULT_NODE_VALUES.uiProps.withLabel } = uiProps;

  const borderColor = uiProps.colorBorder;

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
          nodeData.comment ? (
            <span style={style.comment}>{nodeData.comment}</span>
          ) : (
            ''
          )
        }
        enterDelay={800}
        arrow
      >
        <span style={{ ...style.displayNode, ...nodeWidth }} className="icons">
          <NodeLabel
            label={nodeData.ewoks_props.label || ''}
            showFull={withLabel}
            showCropped={!withLabel && !withImage}
            color={uiProps.exists ? '#ced3ee' : 'red'}
          />
          {withImage && (
            <SuspenseBoundary>
              <NodeIcon nodeId={id} onDragStart={(e) => e.preventDefault()} />
            </SuspenseBoundary>
          )}
          <span style={style.contentWrapper}>
            {uiProps.inputs
              ?.sort((a, b) => (a.positionY || 0) - (b.positionY || 0))
              .map((input: { label: string }) => (
                <div
                  key={input.label}
                  style={{
                    ...contentStyle.io,
                    ...contentStyle.textLeft,
                    ...(uiProps.moreHandles ? contentStyle.borderInput : {}),
                  }}
                >
                  {/* remove the rest of the input {input.label} for now */}
                  {input.label.slice(0, input.label.indexOf(':'))}
                  <Handle
                    key={input.label}
                    type="target"
                    position={Position.Left}
                    id={input.label.slice(0, input.label.indexOf(':'))}
                    style={{
                      ...contentStyle.handle,
                      ...contentStyle.left,
                      ...contentStyle.handleTarget,
                    }}
                    isValidConnection={isValidConnection}
                  />
                  {uiProps.moreHandles && (
                    <Handle
                      key={`${input.label} right`}
                      type="target"
                      position={Position.Right}
                      id={`${input.label.slice(
                        0,
                        input.label.indexOf(':')
                      )} right`}
                      style={{
                        ...contentStyle.handle,
                        ...contentStyle.right,
                        ...contentStyle.handleTarget,
                      }}
                      isValidConnection={isValidConnection}
                    />
                  )}
                </div>
              ))}
            {uiProps.outputs
              ?.sort((a, b) => (a.positionY || 0) - (b.positionY || 0))
              .map((output: { label: string }) => (
                <div
                  key={output.label}
                  style={{
                    ...contentStyle.io,
                    ...contentStyle.textRight,
                    ...(uiProps.moreHandles ? contentStyle.borderOutput : {}),
                  }}
                >
                  {output.label.slice(0, output.label.indexOf(':'))}
                  <Handle
                    key={output.label}
                    type="source"
                    position={Position.Right}
                    id={output.label.slice(0, output.label.indexOf(':'))}
                    style={{
                      ...contentStyle.handle,
                      ...contentStyle.right,
                      ...contentStyle.handleSource,
                    }}
                    isValidConnection={isValidConnection}
                  />
                  {uiProps.moreHandles && (
                    <Handle
                      key={`${output.label} left`}
                      type="source"
                      position={Position.Left}
                      id={`${output.label.slice(
                        0,
                        output.label.indexOf(':')
                      )} left`}
                      style={{
                        ...contentStyle.handle,
                        ...contentStyle.left,
                        ...contentStyle.handleSource,
                      }}
                      isValidConnection={isValidConnection}
                    />
                  )}
                </div>
              ))}
          </span>
        </span>
      </Tooltip>
    </div>
  );
}

export default memo(GraphNode);
