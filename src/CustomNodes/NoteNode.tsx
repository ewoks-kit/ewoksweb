/* eslint-disable react/function-component-definition */
/* jshint sub:true*/
import React, { useEffect } from 'react';
import { IconButton, TextField } from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditOutlined';
import { style } from './NodeStyle';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';
import useStore from '../store';

const onDragStart = (e) => {
  e.preventDefault();
};
const isValidOutput = (connection) => {
  return true;
};

const NoteNode = (args) => {
  const [comment, setComment] = React.useState('');
  const [edit, setEdit] = React.useState(false);
  const graphRF = useStore((state) => state.graphRF);
  const setGraphRF = useStore((state) => state.setGraphRF);

  useEffect(() => {
    setComment(args.data.comment);
  }, [args.data.comment]);

  console.log(args.data.label, args.data.comment);
  const customTitle = {
    ...style.title,
    wordWrap: 'break-word',
    borderRadius: '10px',
    // color: 'red',
    backgroundColor: '#ced3ee',
    textAlign: 'center',
  };

  const commentChanged = (event) => {
    console.log(args);
    setComment(event.target.value);
  };

  const cancel = () => {
    setEdit(false);
  };

  const save = () => {
    // update graphRF on store
    setGraphRF({
      graph: graphRF.graph,
      links: graphRF.links,
      nodes: [
        ...graphRF.nodes.filter((nod) => nod.id !== args.id),
        {
          data: {
            label: args.data.label,
            comment: comment,
          },
          id: args.id,
          task_type: args.data.label,
          task_identifier: args.data.label,
          type: 'note',
          position: { x: args.xPos, y: args.Ypos },
        },
      ],
    });
    setEdit(false);
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
    >
      <span style={{ maxWidth: '120px' }} className="icons">
        {args.data.label.length > 0 && (
          <div style={customTitle as React.CSSProperties}>
            {args.data.label}
          </div>
        )}
        {edit ? (
          <TextField
            id="standard-multiline-flexible"
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

        {!edit ? (
          <IconButton
            style={{ padding: '0px' }}
            aria-label="edit"
            onClick={() => {
              setEdit(true);
            }}
          >
            <EditIcon />
          </IconButton>
        ) : (
          <>
            <SaveIcon onClick={save} />

            <UndoIcon onClick={cancel} />
          </>
        )}
      </span>
    </div>
  );
};

export default NoteNode;
