import React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import { makeStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import state from '../store/state';

const useStyles = makeStyles((theme) => ({
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
  const [success, setSuccess] = React.useState(false);
  const isExecuted = state((state) => state.isExecuted);
  const setIsExecuted = state((state) => state.setIsExecuted);
  const timer = React.useRef<number>();
  const classes = useStyles();

  // TODO: synd with the real time the call makes using getting
  React.useEffect(() => {
    // console.log('getting', getting);
    if (getting) {
      setLoading(true);
    } else setLoading(false);
  }, [getting]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
