import type { NodeProps } from '@xyflow/react';

import useNodeDataStore from '../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import styles from './Nodes.module.css';
import NodeWrapper from './NodeWrapper';

function NoteNode(args: NodeProps) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));
  assertNodeDataDefined(nodeData, args.id);

  const { nodeWidth, colorBorder } = nodeData.ui_props;

  return (
    <NodeWrapper
      className={styles.noteNode}
      width={nodeWidth}
      borderColor={colorBorder}
    >
      {nodeData.ewoks_props.label || args.id}
    </NodeWrapper>
  );
}

export default NoteNode;
