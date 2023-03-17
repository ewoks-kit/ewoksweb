import React, { memo } from 'react';
import type { NodeProps } from 'reactflow';
import Node from './Node';
import { contentStyle as style } from './NodeStyle';
import useNodeDataStore from '../store/useNodeDataStore';

function DataNode(args: NodeProps) {
  const nodesData = useNodeDataStore((state) => state.nodesData);

  const uiProps = nodesData.get(args.id)?.ui_props;
  console.log(args, uiProps);

  return (
    <Node
      isGraph={false}
      type={uiProps?.type || 'internal'}
      label={args.data.ewoks_props.label}
      selected={args.selected}
      color="#ced3ee"
      image={uiProps?.icon}
      comment={args.data.comment}
      moreHandles={uiProps?.moreHandles}
      details={uiProps?.details}
      withImage={uiProps && 'withImage' in uiProps ? uiProps?.withImage : true}
      nodeWidth={uiProps && 'nodeWidth' in uiProps ? uiProps?.nodeWidth : 100}
      withLabel={uiProps && 'withLabel' in uiProps ? uiProps?.withLabel : true}
      colorBorder={
        uiProps && 'colorBorder' in uiProps ? uiProps?.colorBorder : ''
      }
      content={<div style={{ ...style.io } as React.CSSProperties} />}
      executing={uiProps?.executing}
    />
  );
}

export default memo(DataNode);
