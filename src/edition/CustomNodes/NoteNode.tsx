import type { NodeProps } from 'reactflow';

import useNodeDataStore from '../../store/useNodeDataStore';
import type { NodeData } from '../../types';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import NodeLabel from './NodeLabel';

type NoteProps = NodeProps<NodeData>;

function NoteNode(args: NoteProps) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));
  assertNodeDataDefined(nodeData, args.id);

  const uiProps = nodeData.ui_props;

  return (
    <div
      className="node-content"
      style={{
        padding: '10px',
        borderColor: uiProps.colorBorder,
      }}
    >
      <div
        style={{ maxWidth: `${uiProps.nodeWidth || 100}px` }}
        className="icons"
      >
        <NodeLabel
          id={args.id}
          label={nodeData.ewoks_props.label}
          showFull
          color="#ced3ee"
        />
        <div style={{ wordWrap: 'break-word' }}>{nodeData.comment}</div>
      </div>
    </div>
  );
}

export default NoteNode;
