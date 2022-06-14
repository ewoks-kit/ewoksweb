import React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import { makeStyles } from '@material-ui/core/styles';

// import state from '../store/state';

const useStyles = makeStyles(() => ({
  top: {
    animationDuration: '550ms',
    // animation: 'animation-61bdi0 1.4s linear infinite',
    position: 'absolute',
    left: 60,
  },
  openFileButton: {
    // backgroundColor: '#96a5f9',
    width: '62px',
    height: '62px',
  },
}));

export default function ExecuteSpinner({ children, tooltip, action, getting }) {
  const [loading, setLoading] = React.useState(false);
  const [success] = React.useState(false);
  // const inExecutionMode = state((state) => state.inExecutionMode);
  // const setInExecutionMode = state((state) => state.setInExecutionMode);
  // const timer = React.useRef<number>();
  const classes = useStyles();
  /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
  console.warn(tooltip, action, getting);

  // TODO: synd with the real time the call makes using getting
  React.useEffect(() => {
    if (getting) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [getting]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* sx={{ display: 'flex', alignItems: 'center' }} */}
      <Box sx={{ m: 1, position: 'relative' }}>
        <Fab
          className={classes.openFileButton}
          // color="primary"
          size="large"
          component="span"
          aria-label="add"
        >
          {success ? <CheckIcon /> : loading ? '...' : children}
        </Fab>
        {loading && (
          <CircularProgress
            size={66}
            className={classes.top}
            thickness={4}
            // {...props}
            value={100}
            style={{
              color: 'white',
              position: 'absolute',
              top: -3,
              left: -3,
              // top: -4,
              // left: 18,
              zIndex: 1,
            }}
          />
        )}
      </Box>
    </Box>
  );
}
