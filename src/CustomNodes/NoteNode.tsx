/* eslint-disable react/function-component-definition */
/* jshint sub:true*/
import React, { useEffect, useState } from 'react';
import { style } from './NodeStyle';
import SaveIcon from '@material-ui/icons/Save';
import type { ChangeEvent } from 'react';
import { IconButton, TextField } from '@material-ui/core';
import type { NodeProps } from 'reactflow';
import { useReactFlow } from 'reactflow';
import type { EwoksRFNodeData } from '../types';
import { useSelectedElement } from '../store/graph-hooks';

type NoteProps = NodeProps<EwoksRFNodeData>;

const NoteNode = (args: NoteProps) => {
  const selectedElement = useSelectedElement();
  const { getNodes, setNodes } = useReactFlow();

  const [comment, setComment] = useState('');

  useEffect(() => {
    setComment(args.data.comment || '');
  }, [args.data]);

  const customTitle = {
    ...style.title,
    wordWrap: 'break-word',
    borderRadius: '10px',
    backgroundColor: '#ced3ee',
    textAlign: 'center',
    padding: '1px',
  };

  const commentChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const save = () => {
    // TODO: If permenant put it in undo-redo and make title editable
    const newNode = {
      ...selectedElement,
      data: {
        task_props: { task_type: 'note', task_identifier: args.id },
        ewoks_props: { label: args.data.ewoks_props.label },
        ui_props: {},
        comment,
      },
      id: args.id,
      type: 'note',
      position: { x: args.xPos || 500, y: args.yPos || 500 },
    };
    // Many things change here. Examine
    setNodes([
      ...getNodes().filter((nod) => nod.id !== selectedElement.id),
      newNode,
    ]);
  };

  return (
    <div
      style={
        {
          ...style.body,
          ...(args.selected ? style.selected : []),
          padding: '10px',
        } as React.CSSProperties
      }
      role="button"
      tabIndex={0}
    >
      <span
        style={{ maxWidth: `${args.data.ui_props.nodeWidth || 100}px` }}
        className="icons"
      >
        {args.data.ewoks_props.label &&
          args.data.ewoks_props.label.length > 0 && (
            <div style={customTitle as React.CSSProperties}>
              {args.data.ewoks_props.label}
            </div>
          )}
        {args.data.ui_props.details ? (
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
        {args.data.ui_props.details && (
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
};

export default NoteNode;
