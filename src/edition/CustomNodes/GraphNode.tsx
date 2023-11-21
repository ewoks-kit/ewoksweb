import type { NodeProps } from 'reactflow';

import useNodeDataStore from '../../store/useNodeDataStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import type { NodeData } from '../../types';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import GraphNodeContent from './GraphNodeContent';

function GraphNode(props: NodeProps<NodeData>) {
  const { id } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(id));
  assertNodeDataDefined(nodeData, id);

  return (
    <SuspenseBoundary>
      <GraphNodeContent {...props} />
    </SuspenseBoundary>
  );
}

export default GraphNode;
