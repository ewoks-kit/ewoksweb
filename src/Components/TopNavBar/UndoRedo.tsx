import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';

import { Fab, IconButton, Tooltip } from '@material-ui/core';
import { useDashboardStyles } from '../Dashboard/useDashboardStyles';
import tooltipText from '../General/TooltipText';
import useStore from '../../store/useStore';

interface undoRedoProps {
  undo: () => void;
  redo: () => void;
}

export default function UndoRedo({ undo, redo }: undoRedoProps) {
  const classes = useDashboardStyles();

  const inExecutionMode = useStore((state) => state.inExecutionMode);

  return (
    <>
      <Tooltip title={tooltipText('Undo')} enterDelay={800} arrow>
        <IconButton
          color="inherit"
          onClick={undo}
          disabled={inExecutionMode}
          data-cy="undoButton"
        >
          <Fab
            className={classes.openFileButton}
            color="primary"
            size="small"
            component="span"
            aria-label="add"
            disabled={inExecutionMode}
          >
            <UndoIcon />
          </Fab>
        </IconButton>
      </Tooltip>
      <Tooltip title={tooltipText('Redo')} enterDelay={800} arrow>
        <IconButton
          color="inherit"
          onClick={redo}
          disabled={inExecutionMode}
          data-cy="redoButton"
        >
          <Fab
            className={classes.openFileButton}
            color="primary"
            size="small"
            component="span"
            aria-label="add"
            disabled={inExecutionMode}
          >
            <RedoIcon />
          </Fab>
        </IconButton>
      </Tooltip>
    </>
  );
}

// testing have a graphRF and test redo-undo functionality on a change...
