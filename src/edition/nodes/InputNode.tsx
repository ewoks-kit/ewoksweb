import type { NodeProps } from '@xyflow/react';

import useNodeDataStore from '../../store/useNodeDataStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import { DEFAULT_NODE_VALUES } from '../../utils/defaultValues';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import { GRAPH_INPUT_ICON } from '../utils';
import NodeIcon from './NodeIcon';
import NodeLabel from './NodeLabel';
import styles from './Nodes.module.css';
import OutputHandle from './OutputHandle';

function InputNode(props: NodeProps) {
  const nodeData = useNodeDataStore((state) => state.nodesData.get(props.id));
  assertNodeDataDefined(nodeData, props.id);
  const { ui_props: uiProps } = nodeData;

  const { borderColor } = uiProps;
  const { withImage = DEFAULT_NODE_VALUES.uiProps.withImage } = uiProps;
  const { withLabel = DEFAULT_NODE_VALUES.uiProps.withLabel } = uiProps;

  return (
    <div className={styles.inputNode} style={{ borderColor }}>
      <OutputHandle />
      <NodeLabel
        id={props.id}
        label={nodeData.ewoks_props.label}
        showFull={withLabel}
        showCropped={!withLabel && !withImage}
      />
      {withImage && (
        <SuspenseBoundary>
          <NodeIcon nodeId={props.id} icon={GRAPH_INPUT_ICON} />
        </SuspenseBoundary>
      )}
    </div>
  );
}

export default InputNode;
