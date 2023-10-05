import { Tooltip } from '@material-ui/core';
import { memo } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';

import useNodeDataStore from '../../store/useNodeDataStore';
import useStore from '../../store/useStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import type { EwoksRFNodeData } from '../../types';
import { DEFAULT_NODE_VALUES } from '../../utils/defaultValues';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import NodeIcon from './NodeIcon';
import NodeLabel from './NodeLabel';
import { contentStyle, style } from './nodeStyles';

function GraphNode(props: NodeProps<EwoksRFNodeData>) {
  const { id } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(id));
  const { loadedGraphs } = useStore.getState();

  assertNodeDataDefined(nodeData, id);

  const { ui_props: uiProps } = nodeData;
  // DOC: the subgraph is connected to the original graph through the task_identifier like
  // simple nodes and not through the id which is the unique in the current graph nodeId
  const subgraphExistsOnServer = loadedGraphs.has(
    nodeData.task_props.task_identifier
  );
  const { inputs = [], outputs = [] } = uiProps;

  const nodeWidth = { width: `${uiProps.nodeWidth || 100}px` };
  const { withImage = DEFAULT_NODE_VALUES.uiProps.withImage } = uiProps;
  const { withLabel = DEFAULT_NODE_VALUES.uiProps.withLabel } = uiProps;

  return (
    <div className="node-content" style={{ borderColor: uiProps.colorBorder }}>
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
            label={
              nodeData.ewoks_props.label || nodeData.task_props.task_identifier
            }
            showFull={withLabel}
            showCropped={!withLabel && !withImage}
            color={subgraphExistsOnServer ? '#ced3ee' : 'red'}
          />
          {withImage && (
            <SuspenseBoundary>
              <NodeIcon nodeId={id} />
            </SuspenseBoundary>
          )}
          <span style={style.contentWrapper}>
            {inputs.length === 0 ? (
              <div
                style={{
                  ...contentStyle.io,
                  ...contentStyle.textLeft,
                }}
              >
                No input provided
              </div>
            ) : (
              inputs
                .sort((a, b) => (a.positionY || 0) - (b.positionY || 0))
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
                      />
                    )}
                  </div>
                ))
            )}
            {outputs.length === 0 ? (
              <div
                style={{
                  ...contentStyle.io,
                  ...contentStyle.textRight,
                }}
              >
                No output provided
              </div>
            ) : (
              outputs
                .sort((a, b) => (a.positionY || 0) - (b.positionY || 0))
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
                      />
                    )}
                  </div>
                ))
            )}
          </span>
        </span>
      </Tooltip>
    </div>
  );
}

export default memo(GraphNode);
