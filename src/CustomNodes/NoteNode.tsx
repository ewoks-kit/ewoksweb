import { useEffect, useState } from 'react';
import { style } from './nodeStyles';
import SaveIcon from '@material-ui/icons/Save';
import type { ChangeEvent } from 'react';
import { IconButton, TextField } from '@material-ui/core';
import type { NodeProps } from 'reactflow';
import type { EwoksRFNodeData } from '../types';
import useNodeDataStore from '../store/useNodeDataStore';
import { assertNodeDataDefined } from '../utils/typeGuards';

type NoteProps = NodeProps<EwoksRFNodeData>;

function NoteNode(args: NoteProps) {
  const [comment, setComment] = useState('');

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const nodeData = useNodeDataStore((state) => state.nodesData.get(args.id));
  assertNodeDataDefined(nodeData, args.id);

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

  const commentChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const save = () => {
    // TBD: If permenant put it in undo-redo and make title editable
    const newNodeData = {
      task_props: { task_type: 'note', task_identifier: args.id },
      ewoks_props: { label: nodeData.ewoks_props.label },
      comment,
    };

    mergeNodeData(args.id, newNodeData);
  };

  return (
    <div
      style={{
        ...style.body,
        padding: '10px',
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
        {nodeData.ui_props.details ? (
          <TextField
            label="edit comment"
            multiline
            maxRows={4}
            value={comment}
            onChange={commentChanged}
            variant="standard"
          />
        ) : (
          <div style={{ wordWrap: 'break-word' }}>{comment}</div>
        )}
        {nodeData.ui_props.details && (
          <IconButton
            style={{ margin: '0px 2px', padding: '0px' }}
            aria-label="edit"
            onClick={save}
          >
            <SaveIcon color="primary" />
          </IconButton>
        )}
      </span>
    </div>
  );
}

export default NoteNode;
