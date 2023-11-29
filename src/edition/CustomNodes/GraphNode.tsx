import type { NodeProps } from 'reactflow';

import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import type { NodeData } from '../../types';
import GraphNodeContent from './GraphNodeContent';

function GraphNode(props: NodeProps<NodeData>) {
  return (
    <SuspenseBoundary>
      <GraphNodeContent {...props} />
    </SuspenseBoundary>
  );
}

export default GraphNode;
