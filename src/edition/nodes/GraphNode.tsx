import type { NodeProps } from '@xyflow/react';

import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import GraphNodeContent from './GraphNodeContent';

function GraphNode(props: NodeProps) {
  return (
    <SuspenseBoundary>
      <GraphNodeContent {...props} />
    </SuspenseBoundary>
  );
}

export default GraphNode;
