import { memo } from 'react';
import type { NodeProps } from 'reactflow';
import Node from './Node';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import useNodeDataStore from '../../store/useNodeDataStore';

function DataNode(props: NodeProps) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(props.id));
  assertNodeDataDefined(nodeData, props.id);

  const uiProps = nodeData.ui_props;

  return (
    <Node
      id={props.id}
      label={nodeData.ewoks_props.label || props.id}
      moreHandles={uiProps.moreHandles}
      withImage={uiProps.withImage}
      withLabel={uiProps.withLabel}
      borderColor={uiProps.colorBorder}
      comment={nodeData.comment}
      width={uiProps.nodeWidth}
    />
  );
}

export default memo(DataNode);
