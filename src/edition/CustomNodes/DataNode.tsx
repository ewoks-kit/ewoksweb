import { memo } from 'react';
import type { NodeProps } from 'reactflow';
import Node from './Node';
import { contentStyle as style } from './nodeStyles';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import useNodeDataStore from '../../store/useNodeDataStore';

function DataNode(props: NodeProps) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(props.id));
  assertNodeDataDefined(nodeData, props.id);

  const uiProps = nodeData.ui_props;

  return (
    <Node
      id={props.id}
      type={nodeData.task_props.task_type}
      label={nodeData.ewoks_props.label || props.id}
      color="#ced3ee"
      comment={nodeData.comment}
      moreHandles={uiProps.moreHandles}
      withImage={'withImage' in uiProps ? uiProps.withImage : true}
      nodeWidth={'nodeWidth' in uiProps ? uiProps.nodeWidth : 100}
      withLabel={'withLabel' in uiProps ? uiProps.withLabel : true}
      colorBorder={'colorBorder' in uiProps ? uiProps.colorBorder : ''}
      content={<div style={style.io} />}
    />
  );
}

export default memo(DataNode);
