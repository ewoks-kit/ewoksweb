import { memo } from 'react';
import { Handle, Position } from 'reactflow';
// import type { Connection } from 'reactflow';
import { contentStyle, style } from './nodeStyles';
// import isValidLink from '../utils/IsValidLink';
// import useStore from '../store/useStore';
// import type { EwoksRFLink, GraphRF } from '../types';
// import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../store/useNodeDataStore';
import { assertNodeDataDefined } from '../utils/typeGuards';
// import { getNodesData } from '../utils';
import { Tooltip } from '@material-ui/core';
import NodeLabel from './NodeLabel';
import IconBoundary from '../IconBoundary';
import NodeIcon from './NodeIcon';

function DiscreteInputOutputNode(props: { id: string }) {
  // const { getNodes, getEdges } = useReactFlow();

  const { id } = props;
  // const graphInfo = useStore((state) => state.graphInfo);
  // const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const nodeData = useNodeDataStore((state) => state.nodesData.get(id));

  assertNodeDataDefined(nodeData, id);

  const { ui_props: uiProps } = nodeData;

  // Todo: validation on discete in-out needs special handling
  // const isValidConnection = (connection: Connection) => {
  //   const graphRf: GraphRF = {
  //     graph: graphInfo,
  //     nodes: getNodes(),
  //     links: getEdges() as EwoksRFLink[],
  //   };
  //   const { isValid, reason } = isValidLink(
  //     connection,
  //     graphRf,
  //     getNodesData()
  //   );
  //   if (!isValid) {
  //     setOpenSnackbar({
  //       open: true,
  //       text: reason,
  //       severity: 'warning',
  //     });
  //   }
  //   return isValid;
  // };

  const inputs: string[] = [
    ...(nodeData.task_props.required_input_names || []),
    ...(nodeData.task_props.optional_input_names || []),
  ];

  const outputs: string[] = [...(nodeData.task_props.output_names || [])];

  const nodeWidth = { width: `${uiProps.nodeWidth || 100}px` };
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
            showFull={uiProps.withLabel}
            showCropped={!uiProps.withLabel && !uiProps.withImage}
            color="#ced3ee"
          />
          {uiProps.withImage && (
            <IconBoundary>
              <NodeIcon
                image={uiProps.icon}
                hasSpinner={false}
                spinnerProps={{
                  getting: uiProps.executing,
                  tooltip: 'Execution',
                  action: () => true,
                }}
                onDragStart={(e) => e.preventDefault()}
              />
            </IconBoundary>
          )}
          <span style={style.contentWrapper}>
            {inputs.map((input) => (
              <div
                key={input}
                style={{
                  ...contentStyle.io,
                  ...contentStyle.textLeft,
                  ...(uiProps.moreHandles ? contentStyle.borderInput : {}),
                }}
              >
                {input}
                <Handle
                  key={input}
                  type="target"
                  position={Position.Left}
                  id={input}
                  style={{
                    ...contentStyle.handle,
                    ...contentStyle.left,
                    ...contentStyle.handleTarget,
                  }}
                  // isValidConnection={isValidConnection}
                />
                {uiProps.moreHandles && (
                  <Handle
                    key="&{input.label} right"
                    type="target"
                    position={Position.Right}
                    id={`${input.slice(0, input.indexOf(':'))} right`}
                    style={{
                      ...contentStyle.handle,
                      ...contentStyle.right,
                      ...contentStyle.handleTarget,
                    }}
                    // isValidConnection={isValidConnection}
                  />
                )}
              </div>
            ))}
            {outputs.map((output) => (
              <div
                key={output}
                style={{
                  ...contentStyle.io,
                  ...contentStyle.textRight,
                  ...(uiProps.moreHandles ? contentStyle.borderOutput : {}),
                }}
              >
                {output}
                <Handle
                  key={output}
                  type="source"
                  position={Position.Right}
                  id={output}
                  style={{
                    ...contentStyle.handle,
                    ...contentStyle.right,
                    ...contentStyle.handleSource,
                  }}
                  // isValidConnection={isValidConnection}
                />
                {uiProps.moreHandles && (
                  <Handle
                    key={`${output} left`}
                    type="source"
                    position={Position.Left}
                    id={`${output.slice(0, output.indexOf(':'))} left`}
                    style={{
                      ...contentStyle.handle,
                      ...contentStyle.left,
                      ...contentStyle.handleSource,
                    }}
                    // isValidConnection={isValidConnection}
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

export default memo(DiscreteInputOutputNode);
