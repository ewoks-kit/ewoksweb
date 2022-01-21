import React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

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

export default function IntegratedSpinner({
  children,
  tooltip,
  action,
  getting,
}) {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<number>();
  const classes = useStyles();

  // TODO: synd with the real time the call makes using getting
  React.useEffect(() => {
    // console.log('getting', getting);
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
    <Tooltip title={tooltip || ''}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Fab
            className={classes.openFileButton}
            color="primary"
            size="small"
            onClick={handleButtonClick}
            component="span"
            aria-label="add"
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
