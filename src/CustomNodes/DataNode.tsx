import React, { memo } from 'react';
import type { NodeProps } from 'reactflow';
import Node from './Node';
import { contentStyle as style } from './NodeStyle';
import useNodeDataStore from '../store/useNodeDataStore';
import { isNodeDataDefined } from '../utils/typeGuards';

function DataNode(args: NodeProps) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));
  isNodeDataDefined(nodeData, args.id);

  const uiProps = nodeData.ui_props;

  return (
    <Node
      isGraph={false}
      type={uiProps.type || 'internal'}
      label={nodeData.ewoks_props.label || ''}
      selected={args.selected}
      color="#ced3ee"
      image={uiProps.icon}
      comment={nodeData.comment}
      moreHandles={uiProps.moreHandles}
      details={uiProps.details}
      withImage={'withImage' in uiProps ? uiProps.withImage : true}
      nodeWidth={'nodeWidth' in uiProps ? uiProps.nodeWidth : 100}
      withLabel={'withLabel' in uiProps ? uiProps.withLabel : true}
      colorBorder={'colorBorder' in uiProps ? uiProps.colorBorder : ''}
      content={<div style={{ ...style.io } as React.CSSProperties} />}
      executing={uiProps.executing}
    />
  );
}

export default memo(DataNode);
