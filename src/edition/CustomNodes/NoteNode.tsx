import type { NodeProps } from 'reactflow';

import useNodeDataStore from '../../store/useNodeDataStore';
import type { NodeData } from '../../types';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import NodeContent from './NodeContent';
import NodeLabel from './NodeLabel';

type NoteProps = NodeProps<NodeData>;

function NoteNode(args: NoteProps) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));
  assertNodeDataDefined(nodeData, args.id);

  const { nodeWidth, colorBorder } = nodeData.ui_props;

  return (
    <NodeContent width={nodeWidth} borderColor={colorBorder}>
      <NodeLabel
        id={args.id}
        label={nodeData.ewoks_props.label}
        showFull
        color="#ced3ee"
      />
      <div style={{ wordWrap: 'break-word' }}>{nodeData.comment}</div>
    </NodeContent>
  );
}

export default NoteNode;
