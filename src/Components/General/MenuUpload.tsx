import { ListItemIcon, ListItemText } from '@material-ui/core';
import type { ChangeEvent } from 'react';
import { Input } from '@material-ui/icons';

import { useLoadGraph } from '../TopNavBar/hooks';

function MenuUpload() {
  const fileNameChanged = useLoadGraph();

  return (
    <>
      <ListItemIcon>
        <Input fontSize="small" />
      </ListItemIcon>
      <input
        style={{ display: 'none' }}
        aria-labelledby="load-graph-label"
        name="load-graph"
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          fileNameChanged(e);
        }}
      />
      <ListItemText id="load-graph-label" primary="Import from disk" />
    </>
  );
}

export default MenuUpload;
