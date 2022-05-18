import React from 'react';
import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';

import { Fab, IconButton, Tooltip } from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';
import tooltipText from '../Components/TooltipText';
import state from '../store/state';

const useStyles = DashboardStyle;

export default function UndoRedo({ undoF, redoF }) {
  const classes = useStyles();

  const isExecuted = state((state) => state.isExecuted);
  const undoIndex = state((state) => state.undoIndex);
  const setUndoIndex = state((state) => state.setUndoIndex);

  const undo = () => {
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
      <Tooltip title={tooltipText('Undo')} enterDelay={800} arrow>
        <IconButton color="inherit" onClick={undo}>
          <Fab
            className={classes.openFileButton}
            color="primary"
            size="small"
            component="span"
            aria-label="add"
            disabled={isExecuted}
          >
            <UndoIcon />
          </Fab>
        </IconButton>
      </Tooltip>
      <Tooltip title={tooltipText('Redo')} enterDelay={800} arrow>
        <IconButton color="inherit" onClick={redo}>
          <Fab
            className={classes.openFileButton}
            color="primary"
            size="small"
            component="span"
            aria-label="add"
            disabled={isExecuted}
          >
            <RedoIcon />
          </Fab>
        </IconButton>
      </Tooltip>
    </>
  );
}

// testing have a graphRF and test redo-undo functionality on a change...
