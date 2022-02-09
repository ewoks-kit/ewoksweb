/* eslint-disable react/function-component-definition */
/* jshint sub:true*/
// import React, { useEffect } from 'react';
import { Badge, Button, IconButton, TextField } from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditOutlined';
import { style } from './NodeStyle';
import SaveIcon from '@material-ui/icons/Save';
import UndoIcon from '@material-ui/icons/Undo';
import useStore from '../store';

const goToEvent = (e) => {
  // update graphRF on store
  console.log(e);
};

const ExecutionStepsNode = (args) => {
  // useEffect(() => {
  // }, [args.data.comment, selectedElement.type]);

  const customTitle = {
    ...style.title,
    wordWrap: 'break-word',
    borderRadius: '10px',
    // color: 'red',
    backgroundColor: '#ced3ee',
    textAlign: 'center',
    padding: '1px',
  };

  return (
    <div
      style={
        {
          ...style.body,
          ...(args.selected ? style.selected : []),
          padding: '2px',
        } as React.CSSProperties
      }
      // id="choice"
      // onMouseOver={() => console.log('onMouseOver')}
      // onFocus={() => {
      //   console.log('onFocus');
      //   setEdit(true);
      // }}
      // role="button"
      // tabIndex={0}
    >
      {args.data.label.split(',').map((val) => {
        return (
          <span style={{ maxWidth: '15px' }} className="icons" key={val}>
            {args.data.label.length > 0 && (
              <div
                onClick={() => goToEvent(val)}
                role="button"
                tabIndex={0}
                style={customTitle as React.CSSProperties}
                key={val}
              >
                {val}
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default ExecutionStepsNode;
