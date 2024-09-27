import type { NodeProps } from 'reactflow';

import useNodeDataStore from '../../store/useNodeDataStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import type { NodeData } from '../../types';
import { DEFAULT_NODE_VALUES } from '../../utils/defaultValues';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import InputHandle from './InputHandle';
import NodeContent from './NodeContent';
import NodeIcon from './NodeIcon';
import NodeLabel from './NodeLabel';
import OutputHandle from './OutputHandle';

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
        {task_type === 'graphInput' && <OutputHandle />}
        <NodeLabel
          id={props.id}
          label={nodeData.ewoks_props.label}
          showFull={withLabel}
          showCropped={!withLabel && !withImage}
        />
        {withImage && (
          <SuspenseBoundary>
            <NodeIcon nodeId={props.id} />
          </SuspenseBoundary>
        )}
        {task_type === 'graphOutput' && <InputHandle />}
      </div>
    </NodeContent>
  );
}

export default GraphInOutNode;
