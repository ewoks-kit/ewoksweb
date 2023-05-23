import { ListItemText } from '@material-ui/core';
import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { FolderOpen } from '@material-ui/icons';

import { useLoadGraph } from './hooks';
import MoreMenuIcon from './MoreMenuIcon';
import useStore from '../../store/useStore';
import StyledMenuItem from './StyledMenuItem';

function UploadMenuItem() {
  const loadGraph = useLoadGraph();
  const ref = useRef<HTMLInputElement>(null);

  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);

  return (
    <StyledMenuItem
      onClick={() => {
        setGraphOrSubgraph(true);
        ref.current?.click();
      }}
      role="menuitem"
    >
      <MoreMenuIcon icon={FolderOpen} />
      <input
        ref={ref}
        style={{ display: 'none' }}
        aria-labelledby="load-graph-label"
        name="load-graph"
        id="load-graph"
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) {
            return;
          }

          loadGraph(file);
        }}
      />
      <ListItemText id="load-graph-label" primary="Open from disk" />
    </StyledMenuItem>
  );
}

export default UploadMenuItem;
