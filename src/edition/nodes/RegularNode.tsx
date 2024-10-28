import type { NodeProps } from '@xyflow/react';
import { Position } from '@xyflow/react';
import { memo } from 'react';

import useNodeDataStore from '../../store/useNodeDataStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import { DEFAULT_NODE_VALUES } from '../../utils/defaultValues';
import InputHandle from './InputHandle';
import NodeIcon from './NodeIcon';
import NodeLabel from './NodeLabel';
import NodeTooltip from './NodeTooltip';
import NodeWrapper from './NodeWrapper';
import OutputHandle from './OutputHandle';

function RegularNode(props: NodeProps) {
  const { id, selected } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(id));

  // Should only be the case during the loading of another graph
  if (!nodeData) {
    return null;
  }

  const { ui_props: uiProps, comment, ewoks_props: ewoksProps } = nodeData;
  const { label } = ewoksProps;
  const { borderColor, moreHandles } = uiProps;
  const { withImage = DEFAULT_NODE_VALUES.uiProps.withImage } = uiProps;
  const { withLabel = DEFAULT_NODE_VALUES.uiProps.withLabel } = uiProps;

  return (
    <NodeWrapper borderColor={borderColor} resizable={selected}>
      <NodeTooltip tooltip={comment}>
        <InputHandle />
        <OutputHandle />

        {moreHandles && (
          <>
            <InputHandle position={Position.Top} id="tt" />
            <OutputHandle position={Position.Top} id="st" />
            <InputHandle position={Position.Bottom} id="tb" />
            <OutputHandle position={Position.Bottom} id="sb" />
          </>
        )}

        <NodeLabel
          id={id}
          label={label}
          showFull={withLabel}
          showCropped={!withLabel && !withImage}
        />
        {withImage && (
          <SuspenseBoundary>
            <NodeIcon nodeId={id} />
          </SuspenseBoundary>
        )}
      </NodeTooltip>
    </NodeWrapper>
  );
}

export default memo(RegularNode);
