import type { ChangeEvent } from 'react';
import { useRef } from 'react';
import { FolderOpen } from '@material-ui/icons';

import { useLoadGraph } from '../hooks';
import useStore from '../../../store/useStore';
import ActionMenuItem from './ActionMenuItem';

function UploadMenuItem() {
  const loadGraph = useLoadGraph();
  const ref = useRef<HTMLInputElement>(null);

  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);

  return (
    <ActionMenuItem
      onClick={() => {
        setGraphOrSubgraph(true);
        ref.current?.click();
      }}
      icon={FolderOpen}
      label="Open from disk"
    >
      <input
        ref={ref}
        style={{ display: 'none' }}
        aria-label="Open from disk"
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
    </ActionMenuItem>
  );
}

export default UploadMenuItem;
