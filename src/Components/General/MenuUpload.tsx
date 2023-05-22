import { ListItemText } from '@material-ui/core';
import type { ChangeEvent } from 'react';
import { FolderOpen } from '@material-ui/icons';

import { useLoadGraph } from '../TopNavBar/hooks';
import MoreMenuIcon from '../TopNavBar/MoreMenuIcon';

function MenuUpload() {
  const fileNameChanged = useLoadGraph();

  return (
    <>
      <MoreMenuIcon icon={FolderOpen} />
      <input
        style={{ display: 'none' }}
        aria-labelledby="load-graph-label"
        name="load-graph"
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          fileNameChanged(e);
        }}
      />
      <ListItemText id="load-graph-label" primary="Open from disk" />
    </>
  );
}

export default MenuUpload;
