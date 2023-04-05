import React, { memo } from 'react';
import type { NodeProps } from 'reactflow';
import Node from './Node';
import { contentStyle as style } from './NodeStyle';
import useNodeDataStore from '../store/useNodeDataStore';

function DataNode(args: NodeProps) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));

  // causes too much instability by breaking the app due to re-renders and race conditions
  // assertNodeDataDefined(nodeData, args.id);

  const uiProps = nodeData?.ui_props;

  return (
    <Node
      isGraph={false}
      type={uiProps?.type || 'internal'}
      label={nodeData?.ewoks_props.label || ''}
      selected={args.selected}
      color="#ced3ee"
      image={uiProps?.icon || ''}
      comment={nodeData?.comment || ''}
      moreHandles={uiProps?.moreHandles}
      details={uiProps?.details}
      withImage={uiProps && 'withImage' in uiProps ? uiProps.withImage : true}
      nodeWidth={uiProps && 'nodeWidth' in uiProps ? uiProps.nodeWidth : 100}
      withLabel={uiProps && 'withLabel' in uiProps ? uiProps.withLabel : true}
      colorBorder={
        uiProps && 'colorBorder' in uiProps ? uiProps.colorBorder : ''
      }
      content={<div style={{ ...style.io } as React.CSSProperties} />}
      executing={uiProps?.executing || false}
    />
  );
}

export default memo(DataNode);
