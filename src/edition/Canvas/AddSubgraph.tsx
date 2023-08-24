import useStore from '../../store/useStore';
import OpenGraphInput from '../../general/OpenGraphInput';
import { useRef } from 'react';

import type { GraphEwoks } from '../../types';
import type { XYPosition } from 'reactflow';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import AddSubgraphDialog from '../TaskDrawer/AddSubgraphDialog';

interface Props {
  openAddSubgraph: boolean;
  subgraphPosition: XYPosition;
  setOpenAddSubgraph: (open: boolean) => void;
}

function AddSubgraph(props: Props) {
  const { openAddSubgraph, subgraphPosition, setOpenAddSubgraph } = props;
  const ref = useRef<HTMLInputElement>(null);
  const rfInstance = useReactFlow();

  const setSubGraph = useStore((state) => state.setSubGraph);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);
  const tasks = useStore((state) => state.tasks);

  async function handleSubgraphLoad(subgraph: GraphEwoks) {
    const nodes = rfInstance.getNodes();
    const { nodeWithoutData, data } = await setSubGraph(
      subgraph,
      nodes,
      rfInstance.getEdges(),
      subgraphPosition,
      tasks
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

      <AddSubgraphDialog
        open={openAddSubgraph}
        onClose={handleClose}
        subgraphPosition={subgraphPosition}
      />
    </>
  );
}

export default AddSubgraph;
