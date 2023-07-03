import { style } from './nodeStyles';
import type { NodeProps } from 'reactflow';
import type { EwoksRFNodeData } from '../types';
import useNodeDataStore from '../store/useNodeDataStore';
import { assertNodeDataDefined } from '../utils/typeGuards';

type NoteProps = NodeProps<EwoksRFNodeData>;

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
      role="button"
      tabIndex={0}
    >
      <div
        style={{ maxWidth: `${uiProps.nodeWidth || 100}px` }}
        className="icons"
      >
        {nodeData.ewoks_props.label &&
          nodeData.ewoks_props.label.length > 0 && (
            <div style={style.noteTitle}>{nodeData.ewoks_props.label}</div>
          )}
        <div style={{ wordWrap: 'break-word' }}>{nodeData.comment}</div>
      </div>
    </div>
  );
}

export default NoteNode;
