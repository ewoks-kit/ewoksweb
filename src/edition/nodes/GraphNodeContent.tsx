import type { NodeProps } from '@xyflow/react';
import { memo } from 'react';

import useNodeDataStore from '../../store/useNodeDataStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import { DEFAULT_NODE_VALUES } from '../../utils/defaultValues';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import GraphInputHandle from './GraphInputHandle';
import styles from './GraphNodeContent.module.css';
import GraphNodeLabel from './GraphNodeLabel';
import GraphOutputHandle from './GraphOutputHandle';
import NodeIcon from './NodeIcon';
import NodeTooltip from './NodeTooltip';
import NodeWrapper from './NodeWrapper';
import { sortByPosition } from './utils';

function GraphNodeContent(props: NodeProps) {
  const { id, selected } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(id));

  assertNodeDataDefined(nodeData, id);

  const { ui_props: uiProps } = nodeData;

  const { inputs = [], outputs = [], borderColor } = uiProps;
  const { withImage = DEFAULT_NODE_VALUES.uiProps.withImage } = uiProps;

  return (
    <NodeWrapper borderColor={borderColor} resizable={selected}>
      <NodeTooltip tooltip={nodeData.comment}>
        <GraphNodeLabel
          label={nodeData.ewoks_props.label}
          graphId={nodeData.task_props.task_identifier}
        />
        {withImage && (
          <SuspenseBoundary>
            <NodeIcon nodeId={id} icon={nodeData.ui_props.icon} />
          </SuspenseBoundary>
        )}
        {inputs.length === 0 ? (
          <div className={styles.handle}>No input provided</div>
        ) : (
          inputs
            .sort(sortByPosition)
            .map((input) => (
              <GraphInputHandle
                key={input.label}
                input={input}
                moreHandles={uiProps.moreHandles}
              />
            ))
        )}
        {outputs.length === 0 ? (
          <div className={styles.handle}>No output provided</div>
        ) : (
          outputs
            .sort(sortByPosition)
            .map((output) => (
              <GraphOutputHandle
                key={output.label}
                output={output}
                moreHandles={uiProps.moreHandles}
              />
            ))
        )}
      </NodeTooltip>
    </NodeWrapper>
  );
}

export default memo(GraphNodeContent);
