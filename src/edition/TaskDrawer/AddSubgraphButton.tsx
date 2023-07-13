import { Add } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import useStore from '../../store/useStore';
import OpenGraphInput from '../../general/OpenGraphInput';
import { useRef } from 'react';

import styles from './TaskDrawer.module.css';

function AddSubgraphButton() {
  const ref = useRef<HTMLInputElement>(null);

  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);

  return (
    <>
      <OpenGraphInput ref={ref} />

      <Tooltip title="Add a subgraph from disk" arrow>
        <button
          className={styles.subgraphButton}
          aria-label="Add a subgraph from disk"
          onClick={() => {
            setGraphOrSubgraph(false);
            ref.current?.click();
          }}
          type="button"
        >
          <Add />G
        </button>
      </Tooltip>
    </>
  );
}

export default AddSubgraphButton;
