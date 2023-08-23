import useStore from '../../store/useStore';
import OpenGraphInput from '../../general/OpenGraphInput';
import { useRef, useState } from 'react';

import type { GraphEwoks } from '../../types';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import AddSubgraphDialog from '../TaskDrawer/AddSubgraphDialog';

interface Props {
  openAddSubgraph: boolean;
  setOpenAddSubgraph: (open: boolean) => void;
}

function AddSubgraph(props: Props) {
  const { openAddSubgraph, setOpenAddSubgraph } = props;
  const ref = useRef<HTMLInputElement>(null);
  const rfInstance = useReactFlow();

  // const [open, setOpen] = useState(false);

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
    setOpenAddSubgraph(false);
  };

  return (
    <>
      <OpenGraphInput
        ref={ref}
        onGraphLoad={(subgraph) => {
          handleSubgraphLoad(subgraph);
        }}
      />

      <AddSubgraphDialog open={openAddSubgraph} onClose={handleClose} />
    </>
  );
}

export default AddSubgraph;
