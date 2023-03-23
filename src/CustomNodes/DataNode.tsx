import React, { memo } from 'react';
import type { NodeProps } from 'reactflow';
import Node from './Node';
import { contentStyle as style } from './NodeStyle';
import useNodeDataStore from '../store/useNodeDataStore';
import { assertNodeDataDefined } from '../utils/typeGuards';

function DataNode(args: NodeProps) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));
  assertNodeDataDefined(nodeData, args.id);

  const { ui_props: uiProps } = nodeData;

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
