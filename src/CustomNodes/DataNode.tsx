import React, { memo } from 'react';
// import { Handle, Position } from 'react-flow-renderer';
import Node from './Node';
import { contentStyle as style } from './NodeStyle';

function DataNode(args) {
  // // console.log(args);
  return (
    <Node
      isGraph={false}
      type={args.type}
      label={args.data.label}
      selected={args.selected}
      color="#ced3ee"
      image={args.data.icon}
      comment={args.data.comment}
      moreHandles={args.data.moreHandles}
      withImage={'withImage' in args.data ? args.data.withImage : true}
      nodeWidth={'nodeWidth' in args.data ? args.data.nodeWidth : 60}
      withLabel={'withLabel' in args.data ? args.data.withLabel : true}
      colorBorder={'colorBorder' in args.data ? args.data.colorBorder : ''}
      content={<div style={{ ...style.io } as React.CSSProperties} />}
      executing={args.data.executing}
    />
  );
}

export default memo(DataNode);
