import type { NodeProps } from '@xyflow/react';

import useNodeDataStore from '../../store/useNodeDataStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import { DEFAULT_NODE_VALUES } from '../../utils/defaultValues';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import { GRAPH_OUTPUT_ICON } from '../utils';
import InputHandle from './InputHandle';
import NodeIcon from './NodeIcon';
import NodeLabel from './NodeLabel';
import styles from './Nodes.module.css';

function OutputNode(props: NodeProps) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(props.id));
  assertNodeDataDefined(nodeData, props.id);
  const { ui_props: uiProps } = nodeData;

  const { borderColor } = uiProps;
  const { withImage = DEFAULT_NODE_VALUES.uiProps.withImage } = uiProps;
  const { withLabel = DEFAULT_NODE_VALUES.uiProps.withLabel } = uiProps;

  return (
    <div className={styles.outputNode} style={{ borderColor }}>
      <InputHandle />
      {withImage && (
        <SuspenseBoundary>
          <NodeIcon nodeId={props.id} icon={GRAPH_OUTPUT_ICON} />
        </SuspenseBoundary>
      )}
      <NodeLabel
        id={props.id}
        label={nodeData.ewoks_props.label}
        showFull={withLabel}
        showCropped={!withLabel && !withImage}
      />
    </div>
  );
}

export default OutputNode;
