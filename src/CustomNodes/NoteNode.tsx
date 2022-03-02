/* eslint-disable react/function-component-definition */
/* jshint sub:true*/
import React, { useEffect } from 'react';
import { style } from './NodeStyle';
import SaveIcon from '@material-ui/icons/Save';

import state from '../store/state';

const NoteNode = (args) => {
  const [comment, setComment] = React.useState('');
  const [edit, setEdit] = React.useState(false);
  const graphRF = state((state) => state.graphRF);
  const setGraphRF = state((state) => state.setGraphRF);
  const selectedElement = state((state) => state.selectedElement);

  useEffect(() => {
    setComment(args.data.comment);
    if (selectedElement.type !== 'note') {
      setEdit(false);
    }
  }, [args.data.comment, selectedElement.type]);

  const customTitle = {
    ...style.title,
    wordWrap: 'break-word',
    borderRadius: '10px',
    // color: 'red',
    backgroundColor: '#ced3ee',
    textAlign: 'center',
    padding: '1px',
  };

  const commentChanged = (event) => {
    // console.log(args);
    setComment(event.target.value);
  };

  // const cancel = () => {
  //   setEdit(false);
  // };

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
            comment,
          },
          id: args.id,
          task_type: 'note',
          task_identifier: args.id,
          type: 'note',
          position: { x: args.xPos, y: args.yPos },
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
      // id="choice"
      // onMouseOver={() => // console.log('onMouseOver')}
      onFocus={() => {
        // console.log('onFocus');
        setEdit(true);
      }}
      role="button"
      tabIndex={0}
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
        {edit && <SaveIcon onClick={save} color="primary" />}
        {/* {!edit ? (
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
        )} */}
      </span>
    </div>
  );
};

export default NoteNode;
