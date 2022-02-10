import React from 'react';
import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';
import useStore from '../store';
import { Fab, IconButton, Tooltip } from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';

const useStyles = DashboardStyle;

export default function UndoRedo({ undoF, redoF }) {
  const classes = useStyles();

  const isExecuted = useStore((state) => state.isExecuted);
  const undoIndex = useStore((state) => state.undoIndex);
  const setUndoIndex = useStore((state) => state.setUndoIndex);

  const undo = () => {
    console.log('UNDO');
    setUndoIndex(undoIndex - 1);
  };

  const redo = () => {
    setUndoIndex(undoIndex + 1);
  };

  React.useEffect(() => {
    undoF.current = undo;
    redoF.current = redo;
  });

  return (
    <>
      <Tooltip title="undo" arrow>
        <IconButton color="inherit">
          <Fab
            className={classes.openFileButton}
            color="primary"
            size="small"
            component="span"
            aria-label="add"
            disabled={isExecuted}
          >
            <UndoIcon onClick={undo} />
          </Fab>
        </IconButton>
      </Tooltip>
      <Tooltip title="redo" arrow>
        <IconButton color="inherit">
          <Fab
            className={classes.openFileButton}
            color="primary"
            size="small"
            component="span"
            aria-label="add"
            disabled={isExecuted}
          >
            <RedoIcon onClick={redo} />
          </Fab>
        </IconButton>
      </Tooltip>
    </>
  );
}
