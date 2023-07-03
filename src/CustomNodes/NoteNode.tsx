import { useEffect, useState } from 'react';
import { style } from './nodeStyles';
import type { NodeProps } from 'reactflow';
import type { EwoksRFNodeData } from '../types';
import useNodeDataStore from '../store/useNodeDataStore';
import { assertNodeDataDefined } from '../utils/typeGuards';

type NoteProps = NodeProps<EwoksRFNodeData>;

function NoteNode(args: NoteProps) {
  const [comment, setComment] = useState('');

  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));
  assertNodeDataDefined(nodeData, args.id);

  const uiProps = nodeData.ui_props;
  const borderColor = 'colorBorder' in uiProps ? uiProps.colorBorder : '';

  useEffect(() => {
    setComment(nodeData.comment || '');
  }, [args.id, nodeData]);

  const customTitle = {
    ...style.title,
    wordWrap: 'break-word',
    borderRadius: '10px',
    backgroundColor: '#ced3ee',
    textAlign: 'center',
    padding: '1px',
  } as const;

  return (
    <div
      className="node-content"
      style={{
        padding: '10px',
        borderColor,
      }}
      role="button"
      tabIndex={0}
    >
      <span
        style={{ maxWidth: `${nodeData.ui_props.nodeWidth || 100}px` }}
        className="icons"
      >
        {nodeData.ewoks_props.label &&
          nodeData.ewoks_props.label.length > 0 && (
            <div style={customTitle}>{nodeData.ewoks_props.label}</div>
          )}
        <div style={{ wordWrap: 'break-word' }}>{comment}</div>
      </span>
    </div>
  );
}

export default NoteNode;
