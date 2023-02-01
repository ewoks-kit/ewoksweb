import React, { memo } from 'react';
import type { NodeProps } from 'reactflow';
import Node from './Node';
import { contentStyle as style } from './NodeStyle';

function DataNode(args: NodeProps) {
  // console.log(args);

  return (
    <Node
      isGraph={false}
      type={args.data.ui_props.type}
      label={args.data.ewoks_props.label}
      selected={args.selected}
      color="#ced3ee"
      image={args.data.ui_props.icon}
      comment={args.data.comment}
      moreHandles={args.data.ui_props.moreHandles}
      details={args.data.ui_props.details}
      withImage={
        'withImage' in args.data.ui_props ? args.data.ui_props.withImage : true
      }
      nodeWidth={
        'nodeWidth' in args.data.ui_props ? args.data.ui_props.nodeWidth : 100
      }
      withLabel={
        'withLabel' in args.data.ui_props ? args.data.ui_props.withLabel : true
      }
      colorBorder={
        'colorBorder' in args.data.ui_props
          ? args.data.ui_props.colorBorder
          : ''
      }
      content={<div style={{ ...style.io } as React.CSSProperties} />}
      executing={args.data.ui_props.executing}
    />
  );
}

export default memo(DataNode);
