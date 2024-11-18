import type { NodeProps } from '@xyflow/react';
import { memo, useEffect, useMemo } from 'react';

import { useWorkflowIds } from '../../api/workflows';
import useNodeDataStore from '../../store/useNodeDataStore';
import useSnackbarStore from '../../store/useSnackbarStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import { DEFAULT_NODE_VALUES } from '../../utils/defaultValues';
import { assertNodeDataDefined } from '../../utils/typeGuards';
import GraphInputHandle from './GraphInputHandle';
import styles from './GraphNodeContent.module.css';
import GraphOutputHandle from './GraphOutputHandle';
import NodeIcon from './NodeIcon';
import NodeLabel from './NodeLabel';
import NodeTooltip from './NodeTooltip';
import NodeWrapper from './NodeWrapper';
import { sortByPosition } from './utils';

function GraphNodeContent(props: NodeProps) {
  const { id, selected } = props;
  const workflowIds = useWorkflowIds();
  const nodeData = useNodeDataStore((state) => state.nodesData.get(id));
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);

  assertNodeDataDefined(nodeData, id);

  // DOC: the subgraph is connected to the original graph through the task_identifier like
  // simple nodes and not through the id which is the unique in the current graph nodeId
  const subgraphExistsOnServer = useMemo(() => {
    return workflowIds.has(nodeData.task_props.task_identifier);
  }, [workflowIds, nodeData.task_props.task_identifier]);

  const { ui_props: uiProps } = nodeData;

  useEffect(() => {
    if (!subgraphExistsOnServer) {
      showErrorMsg(
        `Workflow with id: ${nodeData.task_props.task_identifier} is not available in the list of workflows.
        Please provide the workflow (create new or import from disk) by saving it to the server.
        Then the workflow will be complete, able to be executed and correctly visualized on the canvas.`,
        30_000,
      );
    }
  }, [
    nodeData.task_props.task_identifier,
    showErrorMsg,
    subgraphExistsOnServer,
  ]);

  const { inputs = [], outputs = [], borderColor } = uiProps;
  const { withImage = DEFAULT_NODE_VALUES.uiProps.withImage } = uiProps;
  const { withLabel = DEFAULT_NODE_VALUES.uiProps.withLabel } = uiProps;

  return (
    <NodeWrapper borderColor={borderColor} resizable={selected}>
      <NodeTooltip tooltip={nodeData.comment}>
        <NodeLabel
          id={id}
          label={nodeData.ewoks_props.label}
          showFull={withLabel}
          showCropped={!withLabel && !withImage}
          color={subgraphExistsOnServer ? undefined : 'red'}
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
