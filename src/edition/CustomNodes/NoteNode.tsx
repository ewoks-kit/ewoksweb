import type { NodeProps } from '@xyflow/react';

import useNodeDataStore from '../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import NodeContent from './NodeContent';

function NoteNode(args: NodeProps) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));
  assertNodeDataDefined(nodeData, args.id);

  const { nodeWidth, colorBorder } = nodeData.ui_props;

  return (
    <NodeContent width={nodeWidth} borderColor={colorBorder}>
      <div style={{ wordWrap: 'break-word' }}>
        {nodeData.ewoks_props.label || args.id}
      </div>
    </NodeContent>
  );
}

export default NoteNode;
