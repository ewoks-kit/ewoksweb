import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import type { ReactNode } from 'react';
import { useRef } from 'react';

import OpenGraphInput from './OpenGraphInput';

const useStyles = makeStyles(() =>
  createStyles({
    openFileButton: {
      backgroundColor: '#96a5f9',
    },
  })
);

function Upload(props: { children?: ReactNode } | undefined) {
  const classes = useStyles();
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div>
      <OpenGraphInput ref={ref} />
      <Fab
        className={classes.openFileButton}
        color="primary"
        size="small"
        component="span"
        aria-label="upload"
        onClick={() => ref.current?.click()}
      >
        {props?.children || ''}
      </Fab>
    </div>
  );
}

export default Upload;
