/* eslint-disable jsx-a11y/control-has-associated-label */
import { ListItemIcon, ListItemText } from '@material-ui/core';
import type { ChangeEvent, ReactNode } from 'react';

import InputIcon from '@material-ui/icons/Input';
import { useLoadGraph } from '../TopNavBar/hooks';

function MenuUpload(props: { children?: ReactNode } | undefined) {
  const fileNameChanged = useLoadGraph();

  return (
    <>
      <ListItemIcon>
        <InputIcon fontSize="small" />
      </ListItemIcon>
      <label htmlFor="load-graph">
        <input
          style={{ display: 'none' }}
          id="load-graph"
          name="load-graph"
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            fileNameChanged(e);
          }}
        />

        <ListItemText primary="Import from disk" style={{ margin: '5px' }} />
        {props?.children || ''}
      </label>
    </>
  );
}

export default MenuUpload;
