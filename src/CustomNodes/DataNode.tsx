import React, { memo } from 'react';
// import { Handle, Position } from 'react-flow-renderer';
import Node from './Node';
import { contentStyle as style } from './NodeStyle';

const DataNode = (args) => {
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
      content={<div style={{ ...style.io } as React.CSSProperties} />}
    />
  );
};

export default memo(DataNode);
