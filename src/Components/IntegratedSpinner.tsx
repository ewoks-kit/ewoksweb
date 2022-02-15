import React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import useStore from '../store';

const useStyles = makeStyles((theme) => ({
  top: {
    animationDuration: '550ms',
    // animation: 'animation-61bdi0 1.4s linear infinite',
    position: 'absolute',
    left: 0,
  },
  openFileButton: {
    backgroundColor: '#96a5f9',
  },
}));

// functionality: create the round spin effect changing from loading state
// to success and then to the wait state using the image passed as children.
export default function IntegratedSpinner({
  children,
  tooltip,
  action,
  getting,
}) {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const isExecuted = useStore((state) => state.isExecuted);

  const timer = React.useRef<number>();
  const classes = useStyles();

  // TODO: synd with the real time the call makes using getting
  React.useEffect(() => {
    if (getting) {
      // console.log('gettingIn', getting);
      timer.current = window.setTimeout(() => {
        // setSuccess(false);
        setLoading(false);
      }, 2000);
    }
    // setLoading(getting);

    // return () => {
    //   clearTimeout(timer.current);
    // };
  }, [getting]);

  const handleButtonClick = () => {
    console.log(isExecuted, loading);
    if (!loading) {
      // console.log('getting1', getting);
      const runAction = action ? action() : null;
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        // console.log('getting2', getting);
        setSuccess(true);
        setLoading(false);
      }, 1500);
      timer.current = window.setTimeout(() => {
        // console.log('getting3', getting);
        setSuccess(false);
        setLoading(false);
      }, 3000);
    }
  };

  return (
    <Tooltip title={tooltip || ''} arrow>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Fab
            className={classes.openFileButton}
            color="primary"
            size="small"
            onClick={handleButtonClick}
            component="span"
            aria-label="add"
            disabled={
              loading
                ? true
                : tooltip === 'Execute Workflow and exit Execution mode'
                ? false
                : isExecuted
            }
          >
            {success ? <CheckIcon /> : loading ? '...' : children}
          </Fab>
          {loading && (
            <CircularProgress
              size={46}
              className={classes.top}
              thickness={4}
              // {...props}
              value={100}
              style={{
                color: 'white',
                position: 'absolute',
                top: -4,
                left: -4,
                zIndex: 1,
              }}
            />
          )}
        </Box>
      </Box>
    </Tooltip>
  );
}
