import { Add } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import useStore from '../../store/useStore';
import OpenGraphInput from '../../general/OpenGraphInput';
import { Fab } from '@material-ui/core';
import { useRef } from 'react';

function AddSubgraphButton() {
  const ref = useRef<HTMLInputElement>(null);

  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);

  return (
    <div>
      <OpenGraphInput ref={ref} />

      <Tooltip title="Add a subgraph from disk" arrow>
        <Fab
          color="primary"
          size="small"
          aria-label="Add a subgraph from disk"
          onClick={() => {
            setGraphOrSubgraph(false);
            ref.current?.click();
          }}
          style={{ backgroundColor: '#96a5f9' }}
        >
          <Add />G
        </Fab>
      </Tooltip>
    </div>
  );
}

export default AddSubgraphButton;
