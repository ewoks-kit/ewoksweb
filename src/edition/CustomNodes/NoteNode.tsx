import type { NodeProps } from '@xyflow/react';

import useNodeDataStore from '../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import styles from './Nodes.module.css';
import NodeWrapper from './NodeWrapper';

function NoteNode(props: NodeProps) {
  const { id, selected } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(id));
  assertNodeDataDefined(nodeData, id);

  const { colorBorder } = nodeData.ui_props;

  return (
    <NodeWrapper
      className={styles.noteNode}
      borderColor={colorBorder}
      resizable={selected}
    >
      {nodeData.ewoks_props.label || id}
    </NodeWrapper>
  );
}

export default NoteNode;
