import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';

import { Fab, IconButton, Tooltip } from '@material-ui/core';
import { useEditPageStyles } from '../edition/useEditPageStyles';
import tooltipText from '../General/TooltipText';

interface undoRedoProps {
  undo: () => void;
  redo: () => void;
}

export default function UndoRedo({ undo, redo }: undoRedoProps) {
  const classes = useEditPageStyles();

  return (
    <>
      <Tooltip title={tooltipText('Undo')} enterDelay={800} arrow>
        <IconButton color="inherit" onClick={undo} data-cy="undoButton">
          <Fab
            className={classes.openFileButton}
            color="primary"
            size="small"
            component="span"
            aria-label="undo"
          >
            <UndoIcon />
          </Fab>
        </IconButton>
      </Tooltip>
      <Tooltip title={tooltipText('Redo')} enterDelay={800} arrow>
        <IconButton color="inherit" onClick={redo} data-cy="redoButton">
          <Fab
            className={classes.openFileButton}
            color="primary"
            size="small"
            component="span"
            aria-label="redo"
          >
            <RedoIcon />
          </Fab>
        </IconButton>
      </Tooltip>
    </>
  );
}

// testing have a graphRF and test redo-undo functionality on a change...
