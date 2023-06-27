import { memo } from 'react';
import type { NodeProps } from 'reactflow';
import Node from './Node';
import { contentStyle as style } from './nodeStyles';
import { assertNodeDataDefined } from '../utils/typeGuards';
import useNodeDataStore from '../store/useNodeDataStore';
import type { TaskType } from '../types';

function DataNode(args: NodeProps) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));
  assertNodeDataDefined(nodeData, args.id);

  const uiProps = nodeData.ui_props;

  return (
    <Node
      type={args.type as TaskType}
      label={nodeData.ewoks_props.label || ''}
      selected={args.selected}
      color="#ced3ee"
      image={uiProps.icon || ''}
      node_icon={uiProps.node_icon}
      comment={nodeData.comment || ''}
      moreHandles={uiProps.moreHandles}
      details={uiProps.details}
      withImage={'withImage' in uiProps ? uiProps.withImage : true}
      nodeWidth={'nodeWidth' in uiProps ? uiProps.nodeWidth : 100}
      withLabel={'withLabel' in uiProps ? uiProps.withLabel : true}
      colorBorder={'colorBorder' in uiProps ? uiProps.colorBorder : ''}
      content={<div style={style.io} />}
      executing={uiProps.executing || false}
    />
  );
}

export default memo(DataNode);
