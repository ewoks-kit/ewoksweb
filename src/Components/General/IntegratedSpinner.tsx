import { useState, useEffect, useRef } from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from '@material-ui/core/Tooltip';
import tooltipText from './TooltipText';
import { IconButton } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

interface IntegratedSpinnerProps {
  children: JSX.Element;
  tooltip: string;
  getting: boolean;
  action: () => void;
  onClick?: () => void;
  className?: string;
}

// DOC: create the round spin effect changing from loading state
// to success and then to the wait state using the image passed as children.
export default function IntegratedSpinner(props: IntegratedSpinnerProps) {
  const { children, tooltip, getting, className } = props;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const timer = useRef<number>();

  // TODO: synd with the real time the call makes using getting
  useEffect(() => {
    if (getting) {
      timer.current = window.setTimeout(() => {
        setLoading(false);
      }, 2000);
    }

    // DOC: clearing the timeout breaks the wanted effect of the tick
    // return () => {
    //   clearTimeout(timer.current);
    // };
  }, [getting]);

  function handleButtonClick() {
    if (!loading) {
      if (props.onClick) {
        props.onClick();
      }

      props.action();

      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1500);
      timer.current = window.setTimeout(() => {
        setSuccess(false);
        setLoading(false);
      }, 3000);
    }
  }

  return (
    <Tooltip title={tooltipText(tooltip)} enterDelay={800} arrow>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ m: 1, position: 'relative' }}>
          <IconButton
            className={className}
            color="inherit"
            onClick={handleButtonClick}
            aria-label={tooltip}
            disabled={loading}
          >
            {success ? (
              <CheckIcon />
            ) : loading ? (
              <ArrowUpwardIcon style={{ color: 'white' }} />
            ) : (
              children
            )}
          </IconButton>
          {loading && (
            <CircularProgress
              size={48}
              thickness={4}
              value={100}
              style={{
                animationDuration: '550ms',
                color: 'white',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            />
          )}
        </Box>
      </Box>
    </Tooltip>
  );
}
