import type { NodeProps } from '@xyflow/react';
import { memo } from 'react';

import useNodeDataStore from '../../store/useNodeDataStore';
import Node from './Node';

function DataNode(props: NodeProps) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(props.id));

  // Should only be the case during the loading of another graph
  if (!nodeData) {
    return null;
  }

  const uiProps = nodeData.ui_props;

  return (
    <Node
      id={props.id}
      label={nodeData.ewoks_props.label}
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
