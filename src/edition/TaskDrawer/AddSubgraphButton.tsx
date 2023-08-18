import { Add } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import useStore from '../../store/useStore';
import OpenGraphInput from '../../general/OpenGraphInput';
import { useRef, useState } from 'react';

import styles from './TaskDrawer.module.css';
import type { GraphEwoks } from '../../types';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import AddSubgraphDialog from './AddSubgraphDialog';

function AddSubgraphButton() {
  const ref = useRef<HTMLInputElement>(null);
  const rfInstance = useReactFlow();

  const [open, setOpen] = useState(false);

  const setSubGraph = useStore((state) => state.setSubGraph);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  async function handleSubgraphLoad(subgraph: GraphEwoks) {
    const nodes = rfInstance.getNodes();
    const { nodeWithoutData, data } = await setSubGraph(
      subgraph,
      nodes,
      rfInstance.getEdges()
    );
    rfInstance.setNodes([...nodes, nodeWithoutData]);
    setNodeData(nodeWithoutData.id, data);
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <OpenGraphInput
        ref={ref}
        onGraphLoad={(subgraph) => {
          handleSubgraphLoad(subgraph);
        }}
      />

      <AddSubgraphDialog open={open} setOpen={setOpen} onClose={handleClose} />

      <Tooltip title="Add a subgraph" arrow>
        <button
          className={styles.subgraphButton}
          aria-label="Add a subgraph"
          onClick={() => setOpen(!open)}
          type="button"
        >
          <Add />G
        </button>
      </Tooltip>
    </>
  );
}

export default AddSubgraphButton;
