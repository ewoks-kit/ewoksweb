import { FormControl } from '@mui/material';
import { useUpdateNodeInternals } from '@xyflow/react';

import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import SidebarCheckbox from '../SidebarCheckbox';
import ColorPicker from './ColorPicker';
import styles from './EditNodeStyle.module.css';
import NodeIconControl from './NodeIconControl';

interface Props {
  nodeId: string;
}

export default function EditNodeStyle(props: Props) {
  const { nodeId } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(nodeId));
  assertNodeDataDefined(nodeData, nodeId);

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  const updateNodeInternals = useUpdateNodeInternals();

  function withImageChanged(checked: boolean) {
    mergeNodeData(nodeId, {
      ui_props: {
        withImage: checked,
      },
    });
  }

  function withLabelChanged(checked: boolean) {
    mergeNodeData(nodeId, {
      ui_props: {
        withLabel: checked,
      },
    });
  }

  function handleBorderColorChange(value: string | undefined) {
    if (!nodeData) {
      return;
    }
    const newData = { ...nodeData };
    newData.ui_props.borderColor = value;
    // Cannot use mergeNodeData since it ignores `undefined` values when merging
    setNodeData(nodeId, newData);
  }

  function moreHandlesChanged(checked: boolean) {
    updateNodeInternals(nodeId);
    mergeNodeData(nodeId, {
      ui_props: {
        moreHandles: checked,
      },
    });
  }

  function handleNodeIconChange(value: string) {
    mergeNodeData(nodeId, {
      ui_props: { icon: value },
    });
  }

  function handleNodeIconRemoval() {
    if (!nodeData) {
      return;
    }
    const newData = { ...nodeData };
    newData.ui_props.icon = undefined;
    // Cannot use mergeNodeData since it ignores `undefined` values when merging
    setNodeData(nodeId, newData);
  }

  const isGraphIONode = ['graphInput', 'graphOutput'].includes(
    nodeData.task_props.task_type,
  );
  const isNoteNode = nodeData.task_props.task_type === 'note';
  const isRegularNode = !isGraphIONode && !isNoteNode;

  return (
    <FormControl variant="filled" fullWidth>
      <div>
        {!isNoteNode && (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <SidebarCheckbox
              className={styles.withImage}
              value={
                nodeData.ui_props.withImage === undefined
                  ? true
                  : !!nodeData.ui_props.withImage
              }
              onChange={withImageChanged}
              label="With image"
            />
            <SidebarCheckbox
              value={
                nodeData.ui_props.withLabel === undefined
                  ? true
                  : !!nodeData.ui_props.withLabel
              }
              onChange={withLabelChanged}
              label="With label"
            />
          </div>
        )}
      </div>

      <ColorPicker
        defaultColorVariable="--node--borderColor"
        value={nodeData.ui_props.borderColor}
        onChange={handleBorderColorChange}
        label="Border color"
      />
      {isRegularNode && (
        <SidebarCheckbox
          value={!!nodeData.ui_props.moreHandles}
          onChange={moreHandlesChanged}
          label="More handles"
        />
      )}
      {isRegularNode && (
        <NodeIconControl
          value={nodeData.ui_props.icon}
          onChange={handleNodeIconChange}
          onRemove={handleNodeIconRemoval}
        />
      )}
    </FormControl>
  );
}
